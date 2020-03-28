import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, Slider } from 'react-native';
import { View, Left, Right, Button, List, ListItem } from 'native-base';
import { Text, BoldText } from '../../components';
import { Ionicons } from '@expo/vector-icons';

const prayerList = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function FilterScreen({ route, navigation }) {
  const [selectedPrayers, setSelectedPrayers] = useState(prayerList);
  const [distance, setDistance] = useState(3);
  const user = useSelector(state => state.userState);
  const [minimumParticipants, setMinimumParticipants] = useState(user.gender === 'M' ? 0 : 2);

  function resetFilter() {
    setSelectedPrayers(prayerList);
  }

  function applyFilter() {

  }

  function handlePrayerClick(prayer) {
    if (selectedPrayers.includes(prayer)) {
      setSelectedPrayers(prev => prev.filter(p => p !== prayer));
    }
    else {
      setSelectedPrayers(prev => [...prev, prayer]);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} size={24} />
        </TouchableOpacity>
        <Text style={styles.header}>Filter</Text>
        <TouchableOpacity onPress={resetFilter} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Prayers:</BoldText>
            <View style={styles.prayerList}>
              {prayerList.map((prayer, i) => (
                <Button block rounded success key={i}
                  bordered={!selectedPrayers.includes(prayer)}
                  onPress={() => handlePrayerClick(prayer)}
                  style={{ ...styles.prayerBtn, borderWidth: selectedPrayers.includes(prayer) ? 0 : 2 }}
                >
                  <Text style={{ textTransform: 'capitalize', color: selectedPrayers.includes(prayer) ? '#fff' : '#000' }}>{prayer}</Text>
                </Button>
              ))}
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Distance: {`(< ${distance} km)`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={1}
              value={3}
              step={1}
              maximumValue={50}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
              onValueChange={setDistance}
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Minimum Participants: {`(> ${minimumParticipants} ${minimumParticipants > 1 ? 'people' : 'person'})`}</BoldText>
            <Slider
              style={{ width: '100%', height: 40, marginTop: 15 }}
              minimumValue={user.gender === 'M' ? 0 : 2}
              value={user.gender === 'M' ? 0 : 2}
              step={1}
              maximumValue={50}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#fff"
              onValueChange={setMinimumParticipants}
            />
          </Left>
        </View>

        <View style={styles.applySection}>
          <Button block rounded success style={styles.applyBtn}>
            <Text style={{ color: '#fff', fontSize: 18 }}>APPLY</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize'
  },
  prayerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginRight: 20
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  detailSection: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sectionHeader: {
    fontSize: 18
  },
  sectionSubHeader: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  prayerList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15
  },
  applySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    paddingHorizontal: 10
  }
})