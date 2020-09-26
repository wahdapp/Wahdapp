import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import { Text, LoaderWithoutOverlay } from 'components';
import * as Animatable from 'react-native-animatable';
import dayjs from 'dayjs';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { PIN } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { AnimatedButton } from 'components';
import colors from 'constants/Colors';
import geohash from 'ngeohash';
import { queryMap } from 'services/prayer';

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
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: userPosition.latitude,
          longitude: userPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 800);
        setCurrentRegion(userPosition);
      }, 100);
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
    mapRef.current.animateToRegion({
      ...coordinate,
      latitudeDelta: currentZoom.latitudeDelta,
      longitudeDelta: currentZoom.longitudeDelta,
    });
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

    try {
      const list = await queryMap({ lat: currentRegion.latitude, lng: currentRegion.longitude });
      console.log({ list })
      setNearbyMarkers(list);

      // Gather all unique geohashes to prevent multiple markers on the same spot
      const geohashes = [];
      const filtered = [];
      for (let prayer of list) {
        const hash = geohash.encode(prayer.location.lat, prayer.location.lng);

        if (!geohashes.includes(hash)) {
          geohashes.push(hash);
          filtered.push({ ...prayer, geohash: hash });
        }
      }

      setFilteredNearbyMarkers(filtered);

      setIsQuerying(false);
    }
    catch (e) {
      setIsQuerying(false);
    }
  }

  function handleMarkerPress(marker) {
    const nearbyPrayers = nearbyMarkers.filter(item => geohash.encode(item.location.lat, item.location.lng) === marker.geohash);
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
            <View style={{ alignItems: 'center', minWidth: 150 }}>
              <TouchableWithoutFeedback>
                <Animatable.View
                  animation="rubberBand"
                  iterationCount="infinite"
                  style={{
                    backgroundColor: colors.primary,
                    padding: 10,
                    alignItems: 'center',
                    minWidth: 100,
                    minHeight: 30,
                    borderRadius: 25
                  }}
                >
                  <Text style={{ color: '#fff' }}>{t('CONFIRM')}</Text>
                </Animatable.View>
              </TouchableWithoutFeedback>
              <Image source={PIN} style={{ height: 50, width: 50, marginTop: 15 }} />
            </View>
          </Marker>
        )}
        {filteredNearbyMarkers.length > 0 && (
          filteredNearbyMarkers.map((marker, i) => (
            <Dot
              coordinate={{ latitude: marker.location.lat, longitude: marker.location.lng }}
              onPress={() => handleMarkerPress(marker)}
              key={i}
              color={dayjs().isBefore(dayjs(marker.schedule_time)) ? colors.primary : '#ddd'}
            />
          )
          ))}
      </MapView>
      {selectedLocation ? (
        <TouchableOpacity
          style={styles.removeMarkerBtn}
          onPress={removeMarker}
        >
          <Feather name="x" size={30} color="#7C7C7C" />
        </TouchableOpacity>
      ) : (
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={handleFloatBtnClick}
          >
            <Feather name="map-pin" size={30} color="#ffffff" />
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

function Dot({ coordinate, onPress, color = colors.primary }) {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={{ ...styles.dot, backgroundColor: color }} />
    </Marker>
  )
}