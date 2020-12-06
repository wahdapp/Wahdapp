import React, { useState, useEffect, useMemo } from 'react';
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
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Text, BoldText, Loader } from '@/components';
import { MAN_AVATAR, WOMAN_AVATAR } from '@/assets/images';
import dayjs from 'dayjs';
import { calculateDistance, formatDistance } from '@/helpers/geo';
import { auth } from '@/firebase';
import useOptimisticReducer from 'use-optimistic-reducer';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import colors from '@/constants/colors';
import { deletePrayer, joinPrayer } from '@/services/prayer';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User } from '@/types';
import { RouteProp } from '@react-navigation/native';
import { useLocation, useUserInfo } from '@/hooks/redux';
import { useDispatch } from 'react-redux';
import { cancelPrayer } from '@/actions/prayers';
import { addParticipatedAmount, minusInvitedAmount, minusParticipatedAmount } from '@/actions/user';

type PrayerDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrayerDetail'>;

type PrayerDetailScreenRouteProp = RouteProp<RootStackParamList, 'PrayerDetail'>;

type Props = {
  route: PrayerDetailScreenRouteProp;
  navigation: PrayerDetailScreenNavigationProp;
};

const ScreenHeight = Dimensions.get('window').height;

type ReducerState = {
  isJoined: boolean;
  currentParticipants: User[];
};

type Actions =
  | { type: 'JOIN'; payload: User }
  | { type: 'CANCEL'; id: string }
  | { type: 'FALLBACK'; payload: ReducerState };

function joinReducer(state: ReducerState, action: Actions) {
  switch (action.type) {
    case 'JOIN':
      return {
        isJoined: true,
        currentParticipants: [...state.currentParticipants, action.payload],
      };
    case 'CANCEL':
      return {
        isJoined: false,
        currentParticipants: state.currentParticipants.filter((p) => p.id !== action.id),
      };
    case 'FALLBACK':
      return action.payload;
    default:
      return state;
  }
}

export default function PrayerDetailScreen({ route, navigation }: Props) {
  const { t } = useTranslation(['PRAYER_DETAILS', 'COMMON']);
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const locationState = useLocation();
  const user = useUserInfo();

  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });
  const {
    guests_male,
    guests_female,
    inviter,
    participants,
    prayer,
    schedule_time,
    location,
    id,
    description,
  } = route.params;

  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [joinState, joinDispatch] = useOptimisticReducer(joinReducer, {
    currentParticipants: participants, // in formatted form
    isJoined: participants.map((p) => p.id).includes(auth.currentUser.uid) ? true : false,
  });

  const { isJoined, currentParticipants } = joinState;
  const { lat, lng } = location;

  const isExpired = useMemo(() => dayjs(schedule_time).isBefore(dayjs()), [schedule_time]);

  useEffect(() => {
    getDistance();
  }, [locationState]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openActionSheet} style={{ marginRight: 15 }}>
          <Feather name="more-vertical" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  async function getDistance() {
    setDistance(
      calculateDistance(
        { lat, lon: lng },
        { lat: locationState.latitude, lon: locationState.longitude }
      )
    );
  }

  async function handleJoin() {
    // do the operations for joining
    if (!isJoined) {
      // synchronize with redux state
      dispatch({
        type: 'JOIN_PRAYER',
        payload: { prayerID: id, userID: auth.currentUser.uid, user },
      });

      joinDispatch({
        type: 'JOIN',
        optimistic: {
          callback: async () => {
            await joinPrayer(id);
            /*
              Increment participated amount.
              No need to revert in fallback, because this will only be
              executed after a successful callback
            */
            dispatch(addParticipatedAmount());
          },
          fallback: (prevState) => {
            // restore previous state, synchronize with redux store
            joinDispatch({ type: 'FALLBACK', payload: prevState });
            dispatch({
              type: 'CANCEL',
              payload: { prayerID: id, userID: auth.currentUser.uid },
            });
          },
          queue: 'join',
        },
        payload: { ...user, id: auth.currentUser.uid },
      });
    } else {
      // synchronize with redux state
      dispatch({
        type: 'LEAVE_PRAYER',
        payload: { prayerID: id, userID: auth.currentUser.uid },
      });

      joinDispatch({
        type: 'CANCEL',
        optimistic: {
          callback: async () => {
            await joinPrayer(id);
            /*
              Decrement participated amount.
              No need to revert in fallback, because this will only be
              executed after a successful callback
            */
            dispatch(minusParticipatedAmount());
          },
          fallback: (prevState) => {
            // restore previous state, synchronize with redux store
            joinDispatch({ type: 'FALLBACK', payload: prevState });
            dispatch({
              type: 'JOIN',
              payload: { prayerID: id, userID: auth.currentUser.uid, user },
            });
          },
          queue: 'join',
        },
        id: auth.currentUser.uid,
      });
    }
  }

  function handleDeletePrayer() {
    Alert.alert(t('CANCEL_PRAYER'), t('CANCEL_PRAYER_CONFIRM'), [
      { text: t('NO') },
      { text: t('YES'), onPress: _deletePrayer, style: 'destructive' },
    ]);
  }

  async function _deletePrayer() {
    setIsLoading(true);
    try {
      await deletePrayer(id);

      dispatch(cancelPrayer(id));
      dispatch(minusInvitedAmount());

      setIsLoading(false);
      navigation.goBack();

      // if (query) {
      //   query();
      // }
    } catch (e) {
      setIsLoading(false);
    }
  }

  function openActionSheet() {
    showActionSheetWithOptions(
      {
        options: [t('OPTIONS.0'), t('OPTIONS.1'), t('OPTIONS.2')],
        title: '',
        message: '',
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        textStyle: { fontFamily: 'Sen', color: colors.primary },
        destructiveColor: colors.error,
      },
      (index) => {
        switch (index) {
          case 0:
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
            break;
          case 1:
            navigation.navigate('ReportPrayer', { prayerID: id });
            break;
        }
      }
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <Loader />}
      <MapView
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: lat,
          longitude: lng,
        }}
        provider="google"
        style={{ width: '100%', height: ScreenHeight * 0.3 }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          onPress={() => openMaps(lat, lng, PRAYERS[prayer])}
        />
      </MapView>
      <ScrollView style={styles.sectionWrapper}>
        <View
          style={[styles.detailSection, { flexDirection: 'row', justifyContent: 'space-between' }]}
        >
          <View>
            <BoldText style={styles.sectionHeader}>{`${dayjs(schedule_time).format(
              'MMM DD'
            )}\n${dayjs(schedule_time).format('hh:mm A')}`}</BoldText>
            <Text style={styles.sectionSubHeader}>{formatDistance(distance, t)}</Text>
          </View>

          {auth.currentUser.uid === inviter.id ? (
            <TouchableWithoutFeedback onPress={handleDeletePrayer}>
              <View style={[styles.button, { backgroundColor: colors.error }]}>
                <Text style={{ color: '#fff' }}>{t('CANCEL')}</Text>
              </View>
            </TouchableWithoutFeedback>
          ) : isExpired ? (
            <View style={[styles.button, { backgroundColor: '#ddd' }]}>
              <Text style={{ color: '#fff' }}>{t('ENDED')}</Text>
            </View>
          ) : (
            <TouchableWithoutFeedback onPress={handleJoin}>
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: isJoined ? colors.primary : '#fff',
                    borderWidth: isJoined ? 0 : 1,
                    borderColor: '#ddd',
                  },
                ]}
              >
                <Text style={{ color: isJoined ? '#fff' : '#7C7C7C' }}>
                  {isJoined ? t('JOINED') : t('JOIN')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <BoldText style={styles.sectionHeader} selectable={true}>
            {t('DESCRIPTION')}
          </BoldText>
          <Text style={styles.sectionSubHeader} selectable={true}>
            {description}
          </Text>
        </View>

        <View style={styles.line} />

        <View style={styles.detailSection}>
          <BoldText style={styles.sectionHeader}>{t('ORGANIZER')}</BoldText>
          <View>
            <UserItem item={inviter} />
          </View>
        </View>

        {currentParticipants.length > 0 && (
          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>
              {t('PARTICIPANTS')} ({currentParticipants.length})
            </BoldText>
            <FlatList
              style={{ width: '100%' }}
              horizontal={true}
              data={currentParticipants}
              renderItem={({ item }) => <UserItem item={item} />}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}

        {(guests_male > 0 || guests_female > 0) && (
          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>
              {t('GUESTS')} ({guests_male + guests_female})
            </BoldText>
            <FlatList
              style={{ width: '100%' }}
              horizontal={true}
              data={[...new Array(guests_male).fill('M'), ...new Array(guests_female).fill('F')]}
              renderItem={({ item }) => <UserItem item={{ gender: item, full_name: 'Guest' }} />}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const UserItem = ({ item }) => (
  <View style={styles.userItem}>
    <View style={{ alignItems: 'center' }}>
      <Image
        source={item.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR}
        style={{ width: 50, height: 50 }}
      />
    </View>
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.userName}>{item.full_name}</Text>
    </View>
  </View>
);

function openMaps(lat, lng, prayer) {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${prayer}@${latLng}`,
    android: `${scheme}${latLng}(${prayer})`,
  });

  Linking.openURL(url);
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  detailSectionWrapper: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize',
  },
  sectionWrapper: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  detailSection: {
    padding: 15,
  },
  sectionHeader: {
    fontSize: 14,
    marginBottom: 10,
    color: '#7C7C7C',
  },
  sectionSubHeader: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
  },
  userItem: {
    marginTop: 15,
    height: 75,
    width: 75,
  },
  userName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'wrap',
    minWidth: 50,
    minHeight: 50,
    color: '#000',
  },
  callout: {
    padding: 8,
    borderRadius: 8,
  },
  calloutText: {
    fontFamily: 'Sen',
    fontSize: 16,
    color: colors.primary,
  },
  button: {
    minWidth: 120,
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});
