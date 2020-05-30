import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  Alert,
  Linking,
  Platform,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, BoldText, Loader } from 'components';
import { MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import moment from 'moment';
import { calculateDistance, formatDistance } from 'helpers/geo';
import { auth, db } from 'firebaseDB';
import useOptimisticReducer from 'use-optimistic-reducer';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

const ScreenHeight = Dimensions.get("window").height;

function joinReducer(state, action) {
  switch (action.type) {
    case 'JOIN':
      return { isJoined: true, currentParticipants: [...state.currentParticipants, action.payload] };
    case 'CANCEL':
      return { isJoined: false, currentParticipants: state.currentParticipants.filter(p => p.id !== action.id) };
    case 'SET_PARTICIPANTS':
      return { ...state, currentParticipants: action.payload };
    case 'FALLBACK':
      return action.payload;
    default:
      return state;
  }
}

export default function PrayerDetailScreen({ route, navigation }) {
  const { t } = useTranslation(['PRAYER_DETAILS', 'COMMON']);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });
  const { geolocation, query, scheduleTime, participants, inviter, inviterID, description, guests, id, prayer } = route.params;
  const location = useSelector(state => state.locationState);
  const user = useSelector(state => state.userState);
  const [originalParticipants, setOriginalParticipants] = useState(participants); // participants in pure form (Ref Object)
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const markerRef = useRef(null);
  const [joinState, joinDispatch] = useOptimisticReducer(joinReducer, {
    currentParticipants: [], // in formatted form
    isJoined: participants.map(p => p.id).includes(auth.currentUser.uid) ? true : false
  });
  const { isJoined, currentParticipants } = joinState;
  const lat = geolocation.latitude;
  const lon = geolocation.longitude;

  const isExpired = useMemo(() => moment(scheduleTime).isBefore(moment()), [scheduleTime]);

  useEffect(() => {
    getDistance();
    getParticipantsInfo();
  }, [location]);

  function onRegionChangeComplete() {
    if (markerRef && markerRef.current && markerRef.current.showCallout) {
      markerRef.current.showCallout();
    }
  }

  async function getParticipantsInfo() {
    const ids = originalParticipants.map(p => p.id);
    const promises = originalParticipants.map(p => p.get());
    const docs = await Promise.all(promises);

    joinDispatch({
      type: 'SET_PARTICIPANTS',
      payload: ids.map((id, i) => ({ ...docs[i].data(), id }))
    });
  }

  async function getDistance() {
    setDistance(calculateDistance({ lat, lon }, { lat: location.latitude, lon: location.longitude }));
  }

  async function handleJoin() {
    // do the operations for joining
    if (!isJoined) {
      joinDispatch({
        type: 'JOIN',
        optimistic: {
          callback: async () => {
            const payload = [...originalParticipants, db.doc('users/' + auth.currentUser.uid)];
            await db.collection('prayers').doc(id).set({ participants: payload }, { merge: true });
            setOriginalParticipants(payload);
          },
          fallback: (prevState) => {
            joinDispatch({ type: 'FALLBACK', payload: prevState });
          }
        },
        payload: { ...user, id: auth.currentUser.uid },
        queue: 'join'
      })
    }
    else {
      joinDispatch({
        type: 'CANCEL',
        optimistic: {
          callback: async () => {
            await db.collection('prayers').doc(id).set({ participants: originalParticipants.filter(p => p.id !== auth.currentUser.uid) }, { merge: true });
          },
          fallback: (prevState) => {
            joinDispatch({ type: 'FALLBACK', payload: prevState });
          }
        },
        id: auth.currentUser.uid,
        queue: 'join'
      })
    }
  }

  function handleDeletePrayer() {
    Alert.alert(
      t('DELETE_PRAYER'),
      t('DELETE_PRAYER_CONFIRM'),
      [{ text: t('NO') }, { text: t('YES'), onPress: deletePrayer, style: 'destructive' }]
    )
  }

  async function deletePrayer() {
    setIsLoading(true);
    await db.collection('prayers').doc(id).delete();
    setIsLoading(false);
    navigation.goBack();
    if (query) {
      query();
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <Loader />}
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
        onRegionChangeComplete={onRegionChangeComplete}
      >
        <Marker ref={markerRef} coordinate={{ latitude: lat, longitude: lon }}>
          <Callout style={{ flex: 1, position: 'relative' }} onPress={() => openMaps(lat, lon, PRAYERS[route.params.prayer])}>
            <View style={styles.callout}>
              <Text style={styles.calloutText}>
                Open in App
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
      <ScrollView style={styles.sectionWrapper}>
        <View style={[styles.detailSection, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View>
            <BoldText style={styles.sectionHeader}>{`${moment(scheduleTime).format('MMM DD')}\n${moment(scheduleTime).format('hh:mm A')}`}</BoldText>
            <Text style={styles.sectionSubHeader}>{formatDistance(distance, t)}</Text>
          </View>

          {auth.currentUser.uid === inviterID ? (
            <TouchableWithoutFeedback onPress={handleDeletePrayer}>
              <View style={[styles.button, { backgroundColor: '#c4302b' }]}>
                <Text style={{ color: '#fff' }}>{t('DELETE')}</Text>
              </View>
            </TouchableWithoutFeedback>
          ) : isExpired ? (
            <View style={[styles.button, { backgroundColor: '#ddd' }]}>
              <Text style={{ color: '#fff' }}>ENDED</Text>
            </View>
          ) : (
                <TouchableWithoutFeedback onPress={handleJoin}>
                  <View style={[styles.button, {
                    backgroundColor: isJoined ? colors.primary : '#fff',
                    borderWidth: isJoined ? 0 : 1,
                    borderColor: '#7C7C7C'
                  }]}>
                    <Text style={{ color: isJoined ? '#fff' : '#7C7C7C' }}>{isJoined ? t('JOINED') : t('JOIN')}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <BoldText style={styles.sectionHeader}>{t('DESCRIPTION')}</BoldText>
          <Text style={styles.sectionSubHeader}>{description}</Text>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <BoldText style={styles.sectionHeader}>{t('ORGANIZER')}</BoldText>
          <View style={styles.userList}>
            <UserItem item={inviter} />
          </View>
        </View>

        {currentParticipants.length > 0 && (
          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>{t('PARTICIPANTS')} ({currentParticipants.length})</BoldText>
            <FlatList
              style={{ width: "100%" }}
              horizontal={true}
              data={currentParticipants}
              renderItem={({ item }) => <UserItem item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        )}

        {(guests.male > 0 || guests.female > 0) && (
          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>{t('GUESTS')} ({guests.male + guests.female})</BoldText>
            <FlatList
              style={{ width: "100%" }}
              horizontal={true}
              data={[...new Array(guests.male).fill('M'), ...new Array(guests.female).fill('F')]}
              renderItem={({ item }) => <UserItem item={{ gender: item, fullName: 'Guest' }} />}
              keyExtractor={item => item.id}
            />
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const UserItem = ({ item }) => (
  <View style={styles.userItem}>
    <View style={{ alignItems: 'center' }}>
      <Image source={item.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 50, height: 50 }} />
    </View>
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.userName}>{item.fullName}</Text>
    </View>
  </View>
)

function openMaps(lat, lng, prayer) {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${prayer}@${latLng}`,
    android: `${scheme}${latLng}(${prayer})`
  });

  Linking.openURL(url);
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  detailSectionWrapper: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize'
  },
  sectionWrapper: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%'
  },
  detailSection: {
    padding: 15,
  },
  sectionHeader: {
    fontSize: 14,
    marginBottom: 10,
    color: '#7C7C7C'
  },
  sectionSubHeader: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  userItem: {
    marginTop: 15,
    height: 75,
    width: 75
  },
  userName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
    minWidth: 50,
    minHeight: 50,
    color: '#000'
  },
  callout: {
    padding: 8,
    borderRadius: 8
  },
  calloutText: {
    fontFamily: 'Sen',
    fontSize: 16,
    color: colors.primary
  },
  button: {
    minWidth: 120,
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  }
})