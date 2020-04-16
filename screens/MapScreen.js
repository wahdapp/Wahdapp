import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import { Text, LoaderWithoutOverlay } from 'components';
import { View, Button } from 'native-base';
import { getGeohashRange, isWithinBoundary } from 'helpers/geo';
import moment from 'moment';
import { db } from 'firebaseDB';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { PIN } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { AnimatedButton } from 'components';
import colors from 'constants/Colors';

export default function MapScreen({ navigation }) {
  const { t } = useTranslation(['INVITATION']);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentZoom, setCurrentZoom] = useState({ latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [userPosition, setUserPosition] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const [filteredNearbyMarkers, setFilteredNearbyMarkers] = useState([]);
  const filter = useSelector(state => state.filterState);
  const user = useSelector(state => state.userState);
  const mapRef = useRef(null);

  useEffect(() => {
    getUserPosition();
  }, []);

  useEffect(() => {
    if (userPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 800);
      setCurrentRegion(userPosition);
    }
  }, [userPosition, mapRef]);

  async function getUserPosition() {
    try {
      const position = await Location.getCurrentPositionAsync({});
      setUserPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }
    catch (e) {
      throw e;
    }
  }

  function handleDrag(coords) {
    setCurrentRegion({ latitude: coords.latitude, longitude: coords.longitude });
    setCurrentZoom({ latitudeDelta: coords.latitudeDelta, longitudeDelta: coords.longitudeDelta });
  }

  function handleLongPress(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    mapRef.current.animateToRegion({
      latitudeDelta: currentZoom.latitudeDelta,
      longitudeDelta: currentZoom.longitudeDelta,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    }, 800)
    setCurrentRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
  }

  // Google Maps only
  function handlePoiClick(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    mapRef.current.animateToRegion({
      latitudeDelta: currentZoom.latitudeDelta,
      longitudeDelta: currentZoom.longitudeDelta,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    }, 800)
    setCurrentRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
  }

  async function handleFloatBtnClick() {
    try {
      mapRef.current.animateToRegion({
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
        latitude: userPosition.latitude,
        longitude: userPosition.longitude
      }, 800)

      setSelectedLocation({ latitude: userPosition.latitude, longitude: userPosition.longitude });
    }
    catch (e) {
      throw e;
    }
  }

  function handleMarkerDrag(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
  }

  function removeMarker() {
    setSelectedLocation(null);
  }

  function handleConfirm(coords) {
    let region = coords;
    if (region.nativeEvent) {
      region = region.nativeEvent.coordinate;
    }
    navigation.navigate('CreateInvitation', { ...region, removeMarker });
  }

  async function queryArea() {
    setIsQuerying(true);
    await fetchNearbyPrayers();
    setIsQuerying(false);
  }

  async function fetchNearbyPrayers() {
    let distance = 2; // set default to 2 kilometers
    const { latitude, longitude } = currentRegion;
    const range = getGeohashRange(latitude, longitude, distance);
    const prayersDoc = await db.collection('prayers')
      .where('geohash', '>=', range.lower)
      .where('geohash', '<=', range.upper)
      .get();

    const prayers = [];

    for (let i = 0; i < prayersDoc.length; i++) {
      const { participants, guests: { male, female }, geohash, gender } = prayersDoc[i].data();

      if (
        isWithinBoundary(geohash, currentRegion, distance) &&
        (1 + participants.length + male + female) >= filter.minimumParticipants && // filter participants number
        (
          (user.gender === gender) ||
          (user.gender === 'F' && !filter.sameGender)
        ) // filter by gender and sameGender preference
      ) {
        prayers.push({ ...prayersDoc[i].data(), id: prayersDoc[i].id });
      }
    }

    if (prayers.length) {
      const inviters = prayers.map(p => p.inviter);
      const ids = inviters.map(i => i.id);
      const promises = inviters.map(i => i.get());
      const docs = await Promise.all(promises);
      setNearbyMarkers(prayers.map((p, i) => ({ ...p, inviter: docs[i].data(), inviterID: ids[i] })));

      // Gather all unique geohashes to prevent multiple markers on the same spot
      const geohashes = [];
      const filtered = [];
      for (let prayer of prayers) {
        if (!geohashes.includes(prayer.geohash)) {
          geohashes.push(prayer.geohash);
          filtered.push(prayer);
        }
      }
      setFilteredNearbyMarkers(filtered);
    }
  }

  function handleMarkerPress(marker) {
    const nearbyPrayers = nearbyMarkers.filter(item => item.geohash === marker.geohash);
    navigation.navigate('MarkerPrayers', { nearbyPrayers, handleConfirm });
  }

  if (!userPosition) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LoaderWithoutOverlay size="large" />
    </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedButton
        showLoading={isQuerying}
        width={150}
        height={30}
        title={t('QUERY')}
        titleFontSize={10}
        titleFontFamily="Sen"
        titleColor="#000"
        backgroundColor="#fff"
        borderRadius={25}
        onPress={queryArea}
        containerStyle={{ position: 'absolute', top: 35, left: 0, right: 0, zIndex: 5 }}
      />
      <MapView
        provider="google"
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
        onPoiClick={handlePoiClick}
        onRegionChangeComplete={handleDrag}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} onPress={handleConfirm} draggable={true} onDragEnd={handleMarkerDrag}>
            <View style={{ alignItems: 'center' }}>
              <Button rounded style={{ backgroundColor: '#fff', paddingHorizontal: 10, justifyContent: 'center', minWidth: 100 }}>
                <Text>{t('CONFIRM')}</Text>
              </Button>
              <Image source={PIN} style={{ height: 35, width: 35, marginTop: 15 }} />
            </View>
          </Marker>
        )}
        {filteredNearbyMarkers.length > 0 && (
          filteredNearbyMarkers.map((marker, i) => (
            moment().isBefore(moment(marker.scheduleTime)) ? (
              <Marker
                coordinate={{ latitude: marker.geolocation.latitude, longitude: marker.geolocation.longitude }}
                onPress={() => handleMarkerPress(marker)}
                key={i}
              />
            ) : (
                <Dot
                  coordinate={{ latitude: marker.geolocation.latitude, longitude: marker.geolocation.longitude }}
                  onPress={() => handleMarkerPress(marker)}
                  key={i}
                />
              )
          ))
        )}
      </MapView>
      {selectedLocation ? (
        <TouchableOpacity
          style={styles.removeMarkerBtn}
          onPress={removeMarker}
        >
          <Ionicons name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} size={30} color="#7C7C7C" />
        </TouchableOpacity>
      ) : (
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={handleFloatBtnClick}
          >
            <Ionicons name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'} size={30} color="#ffffff" />
          </TouchableOpacity>
        )
      }
    </View>
  );
}

MapScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  panel: {
    height: '100%',
    padding: 20,
    backgroundColor: '#ffffffe8',
  },
  header: {
    backgroundColor: '#ffffffe8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
  removeMarkerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  inviteBtn: {
    width: '100%',
    textAlign: 'center'
  },
  dot: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

function Dot({ coordinate, onPress }) {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles.dot} />
    </Marker>
  )
}