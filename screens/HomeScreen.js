import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { View, Button } from 'native-base';
import { PrayerCard, Text } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { db } from 'firebaseDB';
import isEmpty from 'lodash/isEmpty';
import { getGeohashRange } from 'helpers/geo';
import moment from 'moment';

export default function HomeScreen({ navigation }) {
  const [nearbyPrayers, setNearbyPrayers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const filter = useSelector(state => state.filterState);
  const location = useSelector(state => state.locationState);

  useEffect(() => {
    if (!isEmpty(filter) && !isEmpty(location)) {
      // fetch nearby prayers according to filter preference
      fetchNearbyPrayers().then(() => setIsFetching(false));
    }
  }, [filter, location]);

  async function fetchNearbyPrayers() {
    const { latitude, longitude } = location;
    const range = getGeohashRange(latitude, longitude, filter.distance);
    const prayersDoc = await db.collection('prayers')
      .where('geohash', '>=', range.lower)
      .where('geohash', '<=', range.upper)
      .get();

    const prayers = [];

    prayersDoc.forEach(doc => {
      if (
        moment().isBefore(moment(doc.data().scheduleTime)) && // filter by schedule
        doc.data().participants.length >= filter.minimumParticipants // filter participants number
      ) {
        prayers.push({ ...doc.data(), id: doc.id });
      }
    });

    if (prayers.length) {

      const inviters = prayers.map(p => p.inviter);
      const ids = inviters.map(i => i.id);
      const promises = inviters.map(i => i.get());
      const docs = await Promise.all(promises);
      setNearbyPrayers(prayers.map((p, i) => ({ ...p, inviter: docs[i].data(), inviterID: ids[i] })));
    }
  }

  return (
    <View>
      <View style={styles.topHeader}>
        <Ionicons size={24} />
        <Text style={styles.headerText}>Nearby Prayers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-funnel' : 'md-funnel'} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.prayerListWrapper}>
        {isFetching
          ? (
            <View>
              <Text>Loading</Text>
            </View>
          ) : (
            <FlatList
              style={{ height: '100%' }}
              data={nearbyPrayers}
              renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
              keyExtractor={item => item.id}
              onRefresh={() => {
                setIsRefreshing(true)
                fetchNearbyPrayers().then(() => setIsRefreshing(false));
              }}
              refreshing={isRefreshing}
              ListEmptyComponent={() => (
                <View>
                  <Text>No prayer found</Text>
                </View>
              )}
            />
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 18,
    color: '#7C7C7C'
  },
  prayerListWrapper: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 120
  }
})


const mockData = [
  {
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'fajr',
    lat: 39.8861116,
    lon: 32.8454252,
    id: 'KdjOAwjf02dkQ1Z5Lckfksaq',
    inviter: {
      id: 'KdjOAwjf',
      name: 'Abdullah ibn Yasir',
      gender: 'M'
    },
    participants: [
      {
        id: 'Q1ZKdjjf',
        name: 'Ali Khan',
        gender: 'M'
      },
      {
        id: 'fks2dkQ1',
        name: 'Amin',
        gender: 'M'
      },
      {
        id: 'PwqAfjzl',
        name: 'Aisha',
        gender: 'F'
      }
    ]
  },
  {
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'dhuhr',
    lat: 25.0574763,
    lon: 121.5223977,
    id: 'Q1ZKdjjf02dk5LckfksaqOAw',
    inviter: {
      id: 'Q1ZKdjjf',
      name: 'Ali',
      gender: 'M'
    }
  },
  {
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'asr',
    lat: 25.0574763,
    lon: 121.5223977,
    id: 'fks2dkQ1Z5LckaqKdjOAwjf0',
    inviter: {
      id: 'fks2dkQ1',
      name: 'Amin',
      gender: 'M'
    }
  },
  {
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'maghrib',
    lat: 25.0574763,
    lon: 121.5223977,
    id: 'K2kjdkQ1Z5LcOAwdf0jfksaq',
    inviter: {
      id: 'K2kjdkQ1',
      name: 'Omar',
      gender: 'M'
    }
  },
  {
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'isha',
    lat: 25.0574763,
    lon: 121.5223977,
    id: 'd1Z5saqKLf02kQckfkdjOAwj',
    inviter: {
      id: 'd1Z5saqK',
      name: 'Ibrahim',
      gender: 'M'
    }
  }
];