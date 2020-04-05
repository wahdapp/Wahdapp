import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Dimensions, Image, FlatList, ScrollView, Alert } from 'react-native';
import { View, Left, Right, Button } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import { Text, BoldText } from 'components';
import { MARKER, MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import moment from 'moment';
import { calculateDistance, formatDistance } from 'helpers/geo';
import { auth, db } from 'firebaseDB';
import useOptimisticReducer from 'use-optimistic-reducer';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['PRAYER_DETAILS']);
  const { geolocation, query, scheduleTime, participants, inviter, inviterID, description, guests, id } = route.params;
  const location = useSelector(state => state.locationState);
  const user = useSelector(state => state.userState);
  const [originalParticipants, setOriginalParticipants] = useState(participants); // participants in pure form (Ref Object)
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [joinState, joinDispatch] = useOptimisticReducer(joinReducer, {
    currentParticipants: [], // in formatted form
    isJoined: participants.map(p => p.id).includes(auth.currentUser.uid) ? true : false
  });
  const { isJoined, currentParticipants } = joinState;
  console.log({ isJoined, currentParticipants })
  const lat = geolocation.latitude;
  const lon = geolocation.longitude;

  const isExpired = useMemo(() => moment(scheduleTime).isBefore(moment()), [scheduleTime]);

  useEffect(() => {
    getDistance();
    getParticipantsInfo();
  }, [location]);

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
      'Delete Prayer',
      'Are you sure to delete this prayer?',
      [{ text: 'No' }, { text: 'Yes', onPress: deletePrayer }]
    )
  }

  async function deletePrayer() {
    setIsLoading(true);
    await db.collection('prayers').doc(id).delete();
    setIsLoading(false);
    navigation.goBack();
    query();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Spinner visible={isLoading} />
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
      <ScrollView style={styles.sectionWrapper}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{`${moment(scheduleTime).format('MMM DD')}\n${moment(scheduleTime).format('hh:mm A')}`}</BoldText>
            <Text style={styles.sectionSubHeader}>{formatDistance(distance)}</Text>
          </Left>
          <Right>
            {isExpired ? (
              <Button rounded disabled
                style={{ width: 100, justifyContent: 'center' }}
              >
                <Text style={{ color: '#fff' }}>ENDED</Text>
              </Button>
            ) : auth.currentUser.uid === inviterID ? (
              <Button rounded
                style={{ width: 100, justifyContent: 'center', backgroundColor: '#c4302b' }}
                onPress={handleDeletePrayer}
              >
                <Text style={{ color: '#fff' }}>{t('DELETE')}</Text>
              </Button>
            ) : (
                  <Button rounded success
                    bordered={!isJoined}
                    style={{ width: 100, justifyContent: 'center', borderColor: '#7C7C7C' }}
                    onPress={handleJoin}
                  >
                    <Text style={{ color: isJoined ? '#fff' : '#7C7C7C' }}>{isJoined ? t('JOINED') : t('JOIN')}</Text>
                  </Button>
                )}
          </Right>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('DESCRIPTION')}</BoldText>
            <Text style={styles.sectionSubHeader}>{description}</Text>
          </Left>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('ORGANIZER')}</BoldText>
            <View style={styles.userList}>
              <UserItem item={inviter} />
            </View>
          </Left>
        </View>

        {currentParticipants.length > 0 && (
          <View style={styles.detailSection}>
            <Left>
              <BoldText style={styles.sectionHeader}>{t('PARTICIPANTS')} ({currentParticipants.length})</BoldText>
              <FlatList
                style={{ width: "100%" }}
                horizontal={true}
                data={currentParticipants}
                renderItem={({ item }) => <UserItem item={item} />}
                keyExtractor={item => item.id}
              />
            </Left>
          </View>
        )}

        {(guests.male > 0 || guests.female > 0) && (
          <View style={styles.detailSection}>
            <Left>
              <BoldText style={styles.sectionHeader}>{t('GUESTS')} ({guests.male + guests.female})</BoldText>
              <FlatList
                style={{ width: "100%" }}
                horizontal={true}
                data={[...new Array(guests.male).fill('M'), ...new Array(guests.female).fill('F')]}
                renderItem={({ item }) => <UserItem item={{ gender: item, fullName: 'Guest' }} />}
                keyExtractor={item => item.id}
              />
            </Left>
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
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  }
})