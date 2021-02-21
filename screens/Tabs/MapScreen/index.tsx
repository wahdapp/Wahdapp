import React, { useState, useEffect, useRef } from 'react';
import MapView, { MapEvent, Marker, Circle } from 'react-native-maps';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Platform,
  AsyncStorage,
  Linking,
  Alert,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Text, LoaderWithoutOverlay, RoundButton, BoldText } from '@/components';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';
import { PIN } from '@/assets/images';
import GoogleMapsTheme from '@/constants/google-maps-theme';
import { useTranslation } from 'react-i18next';
import { AnimatedButton } from '@/components';
import colors from '@/constants/colors';
import geohash from 'ngeohash';
import { queryMap } from '@/services/prayer';
import { StackNavigationProp } from '@react-navigation/stack';
import { Prayer, RootStackParamList } from '@/types';
import GetNotified from './GetNotified';
import { useMapPrayers, useUserInfo, useLocation } from '@/hooks/redux';
import { updateUserLocation } from '@/services/user';
import { setNotifyRegion } from '@/actions/user';
import { useDispatch } from 'react-redux';
import { logEvent } from 'expo-firebase-analytics';
import useLogScreenView from '@/hooks/useLogScreenView';
import { getLatLong } from '@/helpers/geo';
import { useAuthStatus } from '@/hooks/auth';
import { Notifications } from 'expo';
import { registerToken } from '@/services/device-token';
import { askPermissions, guideToSettings } from '@/helpers/permission';

type FilteredMapQuery = Prayer & { geohash: string };
type Region = {
  latitude: number;
  longitude: number;
};
type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

type Props = {
  navigation: MapScreenNavigationProp;
};

export default function MapScreen({ navigation }: Props) {
  useLogScreenView('map');
  const isAuth = useAuthStatus();
  const user = useUserInfo();
  const { t } = useTranslation(['INVITATION']);
  const dispatch = useDispatch();
  const prayers = useMapPrayers();
  const userPosition: Region = useLocation() as Region;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [currentZoom, setCurrentZoom] = useState({ latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [isQuerying, setIsQuerying] = useState(false);
  const [filteredNearbyMarkers, setFilteredNearbyMarkers] = useState<FilteredMapQuery[]>([]);
  const [showAreaSelectionTip, setShowAreaSelectionTip] = useState(!user.location?.lat);
  const [isChoosingRange, setIsChoosingRange] = useState(false);
  const [notifyLocation, setNotifyLocation] = useState<Region>(
    user.location?.lat
      ? {
          latitude: user.location.lat,
          longitude: user.location.lng,
        }
      : null
  );
  const [hasSeenGetNotified, setHasSeenGetNotified] = useState(true); // whether the user has previously seen the GetNotified screen
  const mapRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        await askPermissions();

        if (!notifyLocation) {
          try {
            const position = await getLatLong();
            setNotifyLocation(position);
          } catch (e) {
            console.log(e);
            setNotifyLocation({ latitude: 0, longitude: 0 });
          }
        }
      } catch (e) {
        guideToSettings();
      }
    })();
  }, []);

  useEffect(() => {
    if (userPosition && mapRef.current) {
      animateToRegion(userPosition);
    }
  }, [userPosition, mapRef]);

  useEffect(() => {
    if (isChoosingRange && mapRef.current) {
      animateToRegion(notifyLocation ?? userPosition);
    }
  }, [isChoosingRange, mapRef]);

  useEffect(() => {
    // if the GetNotified screen has been seen before, don't show it again
    if (isAuth && showAreaSelectionTip) {
      (async () => {
        const hasSeen = await AsyncStorage.getItem('get_notified_visited');

        if (!hasSeen) {
          setHasSeenGetNotified(false);
          AsyncStorage.setItem('get_notified_visited', 'true');
        }
      })();
    }
  }, [isAuth, showAreaSelectionTip]);

  function animateToRegion(region: Region) {
    setTimeout(() => {
      mapRef?.current?.animateToRegion(
        {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        800
      );
      setCurrentRegion(region);
    }, 100);
  }

  function handleDrag(coords) {
    setCurrentRegion({ latitude: coords.latitude, longitude: coords.longitude });
    setCurrentZoom({ latitudeDelta: coords.latitudeDelta, longitudeDelta: coords.longitudeDelta });
  }

  function handleLongPress(coords) {
    // prevent users without an account to select
    if (!isAuth) return;
    // prevent getting triggered while choosing notification area
    if (isChoosingRange) return;

    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    mapRef.current.animateToRegion(
      {
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      800
    );
    setCurrentRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  }

  // Google Maps only
  function handlePoiClick(coords) {
    // prevent users without an account to select
    if (!isAuth) return;
    // prevent getting triggered while choosing notification area
    if (isChoosingRange) return;

    const { coordinate } = coords.nativeEvent;
    setSelectedLocation(coordinate);
    mapRef.current.animateToRegion(
      {
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      800
    );
    setCurrentRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  }

  async function handleFloatBtnClick() {
    mapRef.current.animateToRegion(
      {
        latitudeDelta: currentZoom.latitudeDelta,
        longitudeDelta: currentZoom.longitudeDelta,
        latitude: userPosition.latitude,
        longitude: userPosition.longitude,
      },
      800
    );

    setSelectedLocation({ latitude: userPosition.latitude, longitude: userPosition.longitude });
  }

  const handleMarkerDrag = (setLocation) => (coords) => {
    const { coordinate } = coords.nativeEvent;
    setLocation(coordinate);
    mapRef.current.animateToRegion({
      ...coordinate,
      latitudeDelta: currentZoom.latitudeDelta,
      longitudeDelta: currentZoom.longitudeDelta,
    });
  };

  function removeMarker() {
    setSelectedLocation(null);
  }

  function handleConfirm(location: { latitude: number; longitude: number }) {
    navigation.navigate('CreateInvitation', { ...location, removeMarker });
    logEvent('confirm_location', { type: 'new' });
  }

  async function queryArea() {
    setIsQuerying(true);

    try {
      const list = await queryMap({
        lat: currentRegion.latitude,
        lng: currentRegion.longitude,
        isAuth,
      });

      dispatch({ type: 'SET_MAP', payload: list });

      // Gather all unique geohashes to prevent multiple markers on the same spot
      const geohashes = [];
      const filtered = [];
      for (const prayer of list) {
        const hash = geohash.encode(prayer.location.lat, prayer.location.lng);

        if (!geohashes.includes(hash)) {
          geohashes.push(hash);
          filtered.push({ ...prayer, geohash: hash });
        }
      }

      setFilteredNearbyMarkers(filtered);

      setIsQuerying(false);
    } catch (e) {
      setIsQuerying(false);
    }
  }

  function handleMarkerPress(marker: FilteredMapQuery) {
    const nearbyPrayers = prayers.filter(
      (item) => geohash.encode(item.location.lat, item.location.lng) === marker.geohash
    );
    navigation.navigate('MarkerPrayers', { nearbyPrayers, handleConfirm });
  }

  function setTip(answer: boolean) {
    setShowAreaSelectionTip(false);
    setIsChoosingRange(answer);
    animateToRegion(userPosition);
  }

  async function handleNotificationBtnPress() {
    try {
      await askPermissions();
      setIsChoosingRange(true);
      const token = await Notifications.getExpoPushTokenAsync();
      await registerToken(token);
    } catch (e) {
      guideToSettings();
    }
  }

  async function confirmNotificationRange() {
    try {
      const region = { lat: notifyLocation.latitude, lng: notifyLocation.longitude };
      await updateUserLocation(region);
      dispatch(setNotifyRegion(region));

      setIsChoosingRange(false);
    } catch (e) {
      setIsChoosingRange(false);
    }
  }

  if (isAuth && showAreaSelectionTip && !hasSeenGetNotified) {
    return <GetNotified setTip={setTip} />;
  }

  if (!userPosition) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LoaderWithoutOverlay size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!isChoosingRange && (
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
          containerStyle={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 55 : 35,
            left: 0,
            right: 0,
            zIndex: 5,
          }}
        />
      )}
      <MapView
        provider="google"
        ref={mapRef}
        style={{ flex: 1 }}
        showsUserLocation={true}
        onLongPress={handleLongPress}
        onPoiClick={handlePoiClick}
        onRegionChangeComplete={handleDrag}
        customMapStyle={GoogleMapsTheme}
      >
        {isChoosingRange && notifyLocation && (
          <>
            <Circle
              ref={circleRef}
              onLayout={() =>
                circleRef.current.setNativeProps({
                  strokeColor: 'rgba(109, 199, 176, 0.4)',
                  strokeWidth: 0,
                })
              }
              center={notifyLocation}
              radius={3000}
              strokeWidth={0}
              fillColor="rgba(109, 199, 176, 0.4)"
            />
            <Marker
              coordinate={notifyLocation}
              draggable={true}
              onDragEnd={handleMarkerDrag(setNotifyLocation)}
            />
          </>
        )}
        {!isChoosingRange && selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            onPress={(
              coords: MapEvent<{
                action: 'marker-press';
                id: string;
              }>
            ) =>
              handleConfirm({
                latitude: coords.nativeEvent.coordinate.latitude,
                longitude: coords.nativeEvent.coordinate.longitude,
              })
            }
            draggable={true}
            onDragEnd={handleMarkerDrag(setSelectedLocation)}
          >
            <View style={{ alignItems: 'center', minWidth: 150 }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    padding: 10,
                    alignItems: 'center',
                    minWidth: 100,
                    minHeight: 30,
                    borderRadius: 25,
                  }}
                >
                  <Text style={{ color: '#fff' }}>{t('CONFIRM')}</Text>
                </View>
              </TouchableWithoutFeedback>
              <Image source={PIN} style={{ height: 50, width: 50, marginTop: 15 }} />
            </View>
          </Marker>
        )}
        {filteredNearbyMarkers.length > 0 &&
          filteredNearbyMarkers.map((marker, i) => (
            <Dot
              coordinate={{ latitude: marker.location.lat, longitude: marker.location.lng }}
              onPress={() => handleMarkerPress(marker)}
              key={i}
              color={dayjs().isBefore(dayjs(marker.schedule_time)) ? colors.primary : '#ddd'}
            />
          ))}
      </MapView>
      {isAuth && !isChoosingRange && (
        <TouchableOpacity style={styles.notificationBtn} onPress={handleNotificationBtnPress}>
          <Feather name="bell" size={30} color="#7C7C7C" />
        </TouchableOpacity>
      )}

      {isAuth &&
        !isChoosingRange &&
        (selectedLocation ? (
          <TouchableOpacity style={styles.removeMarkerBtn} onPress={removeMarker}>
            <Feather name="x" size={30} color="#7C7C7C" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.floatingBtn} onPress={handleFloatBtnClick}>
            <Feather name="plus" size={30} color="#ffffff" />
          </TouchableOpacity>
        ))}

      {isChoosingRange && (
        <>
          <View style={styles.areaSelectBanner}>
            <BoldText style={styles.areaSelectBannerText}>{t('NOTIFICATION.TITLE')}</BoldText>
            <Text style={styles.areaSelectBannerDesc}>{t('NOTIFICATION.DESC')}</Text>
          </View>
          <View style={{ ...styles.buttonWrapper, bottom: Platform.OS === 'ios' ? 90 : 80 }}>
            <RoundButton
              onPress={confirmNotificationRange}
              style={{ width: '100%' }}
              touchableStyle={styles.touchableStyle}
            >
              {t('NOTIFICATION.CONFIRM')}
            </RoundButton>
          </View>

          <View style={{ ...styles.buttonWrapper, bottom: Platform.OS === 'ios' ? 25 : 15 }}>
            <RoundButton
              style={{ width: '100%' }}
              backgroundColor="#fff"
              textStyle={{ color: '#7D7D7D' }}
              touchableStyle={styles.touchableStyle}
              onPress={() => setTip(false)}
            >
              {t('NOTIFICATION.CANCEL')}
            </RoundButton>
          </View>
        </>
      )}
    </View>
  );
}

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
    flexWrap: 'wrap',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    right: 10,
    height: 60,
    backgroundColor: colors.secondary,
    borderRadius: 100,
  },
  removeMarkerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    right: 10,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  notificationBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80,
    right: 10,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  inviteBtn: {
    width: '100%',
    textAlign: 'center',
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
  },
  buttonWrapper: {
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  touchableStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  areaSelectBanner: {
    position: 'absolute',
    zIndex: 10,
    top: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    paddingBottom: 25,
  },
  areaSelectBannerText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
  areaSelectBannerDesc: {
    color: '#7D7D7D',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
});

function Dot({ coordinate, onPress, color = colors.primary }) {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={{ ...styles.dot, backgroundColor: color }} />
    </Marker>
  );
}
