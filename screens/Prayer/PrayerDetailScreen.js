import React from 'react';
import { StyleSheet, Dimensions, Image, Platform, TouchableOpacity } from 'react-native';
import { View, Text, Icon } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { MARKER } from '../../assets/images';
import { Ionicons } from '@expo/vector-icons';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

export default function PrayerDetailScreen({ route, navigation }) {
  const { lat, lon } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={24} />
        </TouchableOpacity>
      </View>
      <MapView
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: lat,
          longitude: lon
        }}
        provider="google"
        style={{ width: '100%', height: ScreenHeight * 0.3 }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker coordinate={{ latitude: lat, longitude: lon }}>
          <View>
            <Image source={MARKER} style={{ height: 30, width: 30 }} />
          </View>
        </Marker>
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20
  },
})