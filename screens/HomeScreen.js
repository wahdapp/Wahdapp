import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import { View } from 'native-base';
import { PrayerCard, Text } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { db } from 'firebaseDB';
import isEmpty from 'lodash/isEmpty';
import { getGeohashRange, isWithinBoundary } from 'helpers/geo';
import moment from 'moment';
import { NOT_FOUND } from 'assets/images';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const [nearbyPrayers, setNearbyPrayers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const filter = useSelector(state => state.filterState);
  const location = useSelector(state => state.locationState);
  const user = useSelector(state => state.userState);
  const [cursor, setCursor] = useState(0);
  const { t } = useTranslation(['HOME']);

  useEffect(() => {
    query();
  }, [filter, location]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 25 }} onPress={() => navigation.navigate('Filter', { fetchNearbyPrayers })}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-funnel' : 'md-funnel'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function query() {
    if (!isEmpty(filter) && !isEmpty(location)) {
      console.log({ filter })
      setIsRefreshing(true);
      // fetch nearby prayers according to filter preference
      fetchNearbyPrayers().then(() => {
        setIsFetching(false);
        setIsRefreshing(false);
      });
    }
  }

  async function fetchNearbyPrayers() {
    console.log({ distance: filter.distance })
    const { latitude, longitude } = location;
    const range = getGeohashRange(latitude, longitude, filter.distance);
    console.log({ range })
    const prayersDoc = await db.collection('prayers')
      .where('geohash', '>=', range.lower)
      .where('geohash', '<=', range.upper)
      // .orderBy('geohash')
      // .startAt(cursor)
      // .limit(5)
      .get();

    const prayers = [];

    prayersDoc.forEach(doc => {
      const { participants, guests: { male, female }, scheduleTime, prayer, geohash, gender } = doc.data();

      if (
        isWithinBoundary(geohash, location, filter.distance) &&
        moment().isBefore(moment(scheduleTime)) && // filter by schedule
        (1 + participants.length + male + female) >= filter.minimumParticipants && // filter participants number
        filter.selectedPrayers.includes(prayer) && // filter by prayer
        (
          (user.gender === gender) ||
          (user.gender === 'F' && !filter.sameGender)
        ) // filter by gender and sameGender preference
      ) {
        prayers.push({ ...doc.data(), id: doc.id });
      }
    });

    prayers.sort((a, b) => moment(a.scheduleTime).diff(moment(b.scheduleTime)));

    if (prayers.length) {
      const inviters = prayers.map(p => p.inviter);
      const ids = inviters.map(i => i.id);
      const promises = inviters.map(i => i.get());
      const docs = await Promise.all(promises);
      setNearbyPrayers(prayers.map((p, i) => ({ ...p, inviter: docs[i].data(), inviterID: ids[i] })));
      // setCursor(prev => prev + 5);
    }
  }

  return (
    <View style={{ paddingTop: Platform.OS === 'ios' ? 20 : 24, flex: 1, backgroundColor: '#fff' }}>
      <View style={{ ...styles.prayerListWrapper, height: nearbyPrayers.length ? null : '100%' }}>
        {isFetching
          ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color="#000" size="large" />
            </View>
          ) : (
            <FlatList
              style={{ height: '100%' }}
              data={nearbyPrayers}
              renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} query={query} />}
              keyExtractor={item => item.id}
              onRefresh={() => {
                setIsRefreshing(true)
                fetchNearbyPrayers().then(() => setIsRefreshing(false));
              }}
              refreshing={isRefreshing}
              ListEmptyComponent={() => (
                <View style={styles.imageContainer}>
                  <Image source={NOT_FOUND} style={styles.image} />
                  <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
                </View>
              )}
              // onEndReached={fetchNearbyPrayers}
            />
          )
        }
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 250
  },
  notFoundText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 18,
  }
})