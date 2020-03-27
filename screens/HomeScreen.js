import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { View, Text } from 'native-base';
import PrayerCard from '../components/PrayerCard';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <View style={styles.topHeader}>
        <Text style={styles.headerText}>Nearby Prayers</Text>
      </View>
      <View style={styles.prayerListWrapper}>
        <FlatList
          data={mockData}
          renderItem={({ item }) => <PrayerCard {...item} />}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    paddingVertical: 20,
    alignItems: 'center',
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


const mockData = [
  {
    scheduleTime: 1585292895784,
    timestamp: 1585292895784,
    prayer: 'fajr',
    join: 0,
    max: 0,
    lat: 0,
    lon: 0,
    id: 'KdjOAwjf02dkQ1Z5Lckfksaq'
  },
  {
    scheduleTime: 1585292895784,
    timestamp: 1585292895784,
    prayer: 'dhuhr',
    join: 0,
    max: 0,
    lat: 0,
    lon: 0,
    id: 'Q1ZKdjjf02dk5LckfksaqOAw'
  },
  {
    scheduleTime: 1585292895784,
    timestamp: 1585292895784,
    prayer: 'asr',
    join: 0,
    max: 0,
    lat: 0,
    lon: 0,
    id: 'fks2dkQ1Z5LckaqKdjOAwjf0'
  },
  {
    scheduleTime: 1585292895784,
    timestamp: 1585292895784,
    prayer: 'maghrib',
    join: 0,
    max: 0,
    lat: 0,
    lon: 0,
    id: 'K2kjdkQ1Z5LcOAwdf0jfksaq'
  },
  {
    scheduleTime: 1585292895784,
    timestamp: 1585292895784,
    prayer: 'isha',
    join: 0,
    max: 0,
    lat: 0,
    lon: 0,
    id: 'd1Z5saqKLf02kQckfkdjOAwj'
  }
];