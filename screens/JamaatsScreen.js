import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/Colors';

export default function JamaatsScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  async function getUserLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
    catch (e) {
      throw e;
    }
  }

  const bs = React.createRef();

  function handleLongPress(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    bs.current.snapTo(1);
  }

  // Google Maps only
  function handlePoiClick(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    bs.current.snapTo(1);
  }

  async function handleFloatBtnClick() {
    bs.current.snapTo(1);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setSelectedLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
    catch (e) {
      throw e;
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  const renderContent = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Confirm Prayer Information</Text>
      <Text style={styles.panelSubtitle}>
        People around this area will be notified afterwards
      </Text>
    </View>
  )

  if (!currentRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <>
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
        onPoiClick={handlePoiClick}
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: currentRegion.latitude,
          longitude: currentRegion.longitude
        }}
        showsMyLocationButton={false}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={handleFloatBtnClick}
      >
        <Ionicons name={Platform.OS === 'ios' ? `ios-add` : 'md-add'} size={30} color="#ffffff" />
      </TouchableOpacity>
      <BottomSheet
        ref={bs}
        snapPoints={[500, 400, 250, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={3}
        onCloseEnd={() => setSelectedLocation(null)}
      />
    </>
  );
}

JamaatsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  panel: {
    height: 600,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
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
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
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
    backgroundColor: colors.tintColor,
    borderRadius: 100,
  }
})
