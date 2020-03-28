import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { View } from 'native-base';
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
      setIsRefreshing(true);
      // fetch nearby prayers according to filter preference
      fetchNearbyPrayers().then(() => {
        setIsFetching(false);
        setIsRefreshing(false);
      });
    }
  }, [filter, location]);

  async function fetchNearbyPrayers() {
    console.log({ distance: filter.distance })
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
        doc.data().participants.length >= filter.minimumParticipants && // filter participants number
        filter.selectedPrayers.includes(doc.data().prayer) // filter by prayer
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
        <TouchableOpacity onPress={() => navigation.navigate('Filter', { fetchNearbyPrayers })}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-funnel' : 'md-funnel'} size={24} />
        </TouchableOpacity>
      </View>
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
    </View >
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 120
  }
})