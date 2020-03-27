import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { View } from 'native-base';
import { PrayerCard, Text } from '../components';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <View style={styles.topHeader}>
        <Text style={styles.headerText}>Nearby Prayers</Text>
      </View>
      <View style={styles.prayerListWrapper}>
        <FlatList
          data={mockData}
          renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
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
    scheduleTime: '2020-03-27T17:48:23+08:00',
    timestamp: '2020-03-27T17:48:23+08:00',
    prayer: 'fajr',
    lat: 39.8861116,
    lon: 32.8454252,
    id: 'KdjOAwjf02dkQ1Z5Lckfksaq',
    inviter: {
      id: 'KdjOAwjf',
      name: 'Abdullah',
      gender: 'M'
    },
    participants: [
      {
        id: 'Q1ZKdjjf',
        name: 'Ali',
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
    join: 0,
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
    join: 0,
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
    join: 0,
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
    join: 0,
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