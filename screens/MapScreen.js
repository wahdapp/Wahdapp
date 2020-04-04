import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';
import { Text } from 'components';
import { View, Button, Toast } from 'native-base';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from 'constants/Colors';
import { PIN } from 'assets/images';

export default function MapScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentZoom, setCurrentZoom] = useState({ latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [userPosition, setUserPosition] = useState(null);
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
    // setCurrentRegion({ latitude: coords.latitude, longitude: coords.longitude });
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
      const location = await Location.getCurrentPositionAsync({});
      mapRef.current.animateToRegion({
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }, 800)
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setSelectedLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
    catch (e) {
      throw e;
    }
  }

  function handleMarkerDrag(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
  }

  function handleConfirm() {
    navigation.navigate('CreateInvitation', { ...currentRegion, removeMarker: () => setSelectedLocation(null) });
  }

  if (!userPosition) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 24 }}>
      <MapView
        provider="google"
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
        onPoiClick={handlePoiClick}
        onRegionChangeComplete={handleDrag}
        showsMyLocationButton={false}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} onPress={handleConfirm} draggable={true} onDragEnd={handleMarkerDrag}>
            <View style={{ alignItems: 'center' }}>
              <Button rounded light style={{ paddingHorizontal: 10, justifyContent: 'center', minWidth: 100 }}>
                <Text>Confirm</Text>
              </Button>
              <Image source={PIN} style={{ height: 35, width: 35, marginTop: 15 }} />
            </View>
          </Marker>
        )}
      </MapView>
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={handleFloatBtnClick}
      >
        <Ionicons name={Platform.OS === 'ios' ? 'ios-pin' : 'md-pin'} size={30} color="#ffffff" />
      </TouchableOpacity>
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
    width: 70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 70,
    backgroundColor: '#12967A',
    borderRadius: 100,
  },
  inviteBtn: {
    width: '100%',
    textAlign: 'center'
  }
})
