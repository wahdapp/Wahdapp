import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, ScrollView, Slider } from 'react-native';
import { View, Left, Button, Right, Textarea } from 'native-base';
import { Text, BoldText } from 'components';
import { Ionicons } from '@expo/vector-icons';

const prayerList = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function CreateInvitationScreen({ route, navigation }) {
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const user = useSelector(state => state.userState);

  function handlePrayerClick(prayer) {
    if (selectedPrayer === prayer) {
      setSelectedPrayer('');
    }
    else {
      setSelectedPrayer(prayer);
    }
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-close' : 'md-close'} size={24} />
        </TouchableOpacity>
        <Text style={styles.header}>Invite Prayer</Text>
        <Ionicons size={24} />
      </View>

      <View style={styles.line} />

      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Prayer:</BoldText>
            <View style={styles.prayerList}>
              {prayerList.map((prayer, i) => (
                <Button block rounded success key={i}
                  bordered={selectedPrayer !== prayer}
                  onPress={() => handlePrayerClick(prayer)}
                  style={{ ...styles.prayerBtn, borderWidth: selectedPrayer === prayer ? 0 : 2 }}
                >
                  <Text style={{ textTransform: 'capitalize', color: selectedPrayer === prayer ? '#fff' : '#7C7C7C' }}>{prayer}</Text>
                </Button>
              ))}
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Description:</BoldText>
            <Textarea style={{ width: '100%', borderRadius: 8 }} rowSpan={8} bordered placeholder="Please briefly describe the location" />
          </Left>
        </View>

        <View style={styles.inviteSection}>
          <Button block rounded success style={styles.inviteBtn}>
            <Text style={{ color: '#fff', fontSize: 18 }}>INVITE</Text>
          </Button>
        </View>
      </View>
    </ScrollView >
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
    fontSize: 16
  },
  sectionSubHeader: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  prayerList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15
  },
  inviteSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    paddingHorizontal: 10
  }
})