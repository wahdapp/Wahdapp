import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity as RNTouchableOpacity,
  ScrollView
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { View, Button, Toast } from 'native-base';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/Colors';
import BSListView from '../components/BSListView';

export default function JamaatsScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const { prayer, time, description } = useSelector(state => state.invitationState);

  const listItems = useMemo(() => [
    {
      title: "Prayer",
      description: prayer.length ? prayer : "Choose which prayer to be performed",
      icon: Platform.OS === 'ios' ? 'ios-moon' : 'md-moon',
      nav: 'PrayerSelection'
    },
    {
      title: "Starting time",
      description: time ? time : "Select the approximate time to start",
      icon: Platform.OS === 'ios' ? 'ios-time' : 'md-time',
      nav: 'TimeSelection'
    },
    {
      title: "Description",
      description: description.length ? description.substring(0, 50) : "Please describe the necessary information",
      icon: Platform.OS === 'ios' ? 'ios-pin' : 'md-pin',
      nav: 'Description'
    }
  ], [prayer, time, description]);

  useEffect(() => {
    getUserPosition();
  }, []);

  async function getUserPosition() {
    try {
      const position = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }
    catch (e) {
      throw e;
    }
  }

  const bs = React.createRef();

  function openBottomSheet() {
    bs.current.snapTo(0);
  }

  function handleDrag(coords) {
    setCurrentRegion(coords);
  }

  function handleLongPress(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    setCurrentRegion({
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
    openBottomSheet();
  }

  // Google Maps only
  function handlePoiClick(coords) {
    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    setCurrentRegion({
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    });
    openBottomSheet();
  }

  async function handleFloatBtnClick() {
    openBottomSheet();

    try {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setSelectedLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
    catch (e) {
      throw e;
    }
  }

  function invite() {
    console.log('click')
    if (!prayer.length || !time || !description.length) {
      Toast.show({
        text: "All information is required!",
        buttonText: "OK",
        type: "warning"
      });
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
      <ScrollView>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <BSListView
            itemList={listItems}
            navigate={navigation.navigate}
          />
        </View>
      </ScrollView>
      <RNTouchableOpacity onPress={invite} style={{ flex: 1, flexDirection: 'row' }}>
        <Button style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} success>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>INVITE</Text>
        </Button>
      </RNTouchableOpacity>
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
        provider="google"
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
        onPoiClick={handlePoiClick}
        region={currentRegion}
        onRegionChangeComplete={handleDrag}
        showsMyLocationButton={false}
        mapPadding={{ bottom: selectedLocation ? 400 : 0 }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <RNTouchableOpacity
        style={styles.floatingBtn}
        onPress={handleFloatBtnClick}
      >
        <Ionicons name={Platform.OS === 'ios' ? `ios-add` : 'md-add'} size={30} color="#ffffff" />
      </RNTouchableOpacity>
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
    backgroundColor: colors.tintColor,
    borderRadius: 100,
  },
  inviteBtn: {
    width: '100%',
    textAlign: 'center'
  }
})
