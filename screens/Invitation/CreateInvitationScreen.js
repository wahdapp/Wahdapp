import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import TimePicker from "react-native-24h-timepicker";
import { View, Left, Right, Button, Toast, Textarea, DatePicker } from 'native-base';
import { Text, BoldText } from 'components';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { db, auth, GeoPoint } from 'firebaseDB';
import { fardhs } from 'constants/prayers';
import geohash from 'ngeohash';

export default function CreateInvitationScreen({ route, navigation }) {
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const user = useSelector(state => state.userState);
  const timePickerRef = useRef(null);

  function handlePrayerClick(prayer) {
    if (selectedPrayer === prayer) {
      setSelectedPrayer('');
    }
    else {
      setSelectedPrayer(prayer);
    }
  }

  function handlePickerConfirm(hour, minute) {
    console.log({ hour, minute })
    setTime({ hour, minute });
    timePickerRef.current.close();
  }

  function handleOperation(gender, operator) {
    if (gender === 'M') {
      if (operator === '+') {
        setMale(prev => prev + 1);
      }
      else if (male > 0) {
        setMale(prev => prev - 1);
      }
    }
    else {
      if (operator === '+') {
        setFemale(prev => prev + 1);
      }
      else if (male > 0) {
        setFemale(prev => prev - 1);
      }
    }
  }

  function submit() {
    try {
      // validate date time
      const now = moment();
      const formattedDate = moment(date).format('YYYY-DD-MM');
      const schedule = moment(`${formattedDate} ${time.hour}:${time.minute}`, 'YYYY-DD-MM HH:mm');
      const formattedSchedule = schedule.format();

      console.log({ formattedSchedule })
      console.log(route.params)

      if (now > schedule) {
        throw { message: 'Prayer time cannot be before now' };
      }

      const { latitude, longitude } = route.params;

      db.collection('prayers').add({
        scheduleTime: formattedSchedule,
        timestamp: now.format(),
        prayer: selectedPrayer,
        description,
        geolocation: new GeoPoint(latitude, longitude),
        inviter: db.doc('users/' + auth.currentUser.uid),
        participants: [],
        geohash: geohash.encode(latitude, longitude),
        guests: {
          male,
          female
        }
      })

      navigation.goBack();
    }
    catch (e) {
      if (e.message) {
        console.error(e.message);
        Toast.show({
          text: e.message,
          textStyle: { fontSize: 12 },
          buttonText: 'OK',
          type: 'danger'
        });
      }
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Prayer:</BoldText>
            <View style={styles.prayerList}>
              {fardhs.map((prayer, i) => (
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
            <BoldText style={styles.sectionHeader}>Current participants:</BoldText>
          </Left>
        </View>
        <View style={styles.participantsSection}>
          <View style={styles.participantsRow}>
            <View>
              <Text style={styles.sectionSubHeader}>Male</Text>
            </View>
            <View style={styles.counter}>
              <Button style={styles.operationBtn} onPress={() => handleOperation('M', '-')}>
                <Text style={styles.operationText}>-</Text>
              </Button>
              <Text style={{ minWidth: 30, textAlign: 'center' }}>{male}</Text>
              <Button style={styles.operationBtn} onPress={() => handleOperation('M', '+')}>
                <Text style={styles.operationText}>+</Text>
              </Button>
            </View>
          </View>
          <View style={styles.participantsRow}>
            <View>
              <Text style={styles.sectionSubHeader}>Female</Text>
            </View>
            <View style={styles.counter}>
              <Button style={styles.operationBtn} onPress={() => handleOperation('F', '-')}>
                <Text style={styles.operationText}>-</Text>
              </Button>
              <Text style={{ minWidth: 30, textAlign: 'center' }}>{female}</Text>
              <Button style={styles.operationBtn} onPress={() => handleOperation('F', '+')}>
                <Text style={styles.operationText}>+</Text>
              </Button>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Description:</BoldText>
            <Textarea
              value={description}
              onChangeText={setDescription}
              style={{ width: '100%', borderRadius: 8, fontFamily: 'Sen' }}
              rowSpan={8}
              bordered
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Date:</BoldText>
            <View style={styles.datePicker}>
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date()}
                locale={"en"}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText={moment(date).format('YYYY-MM-DD')}
                formatChosenDate={d => moment(d).format('YYYY-MM-DD')}
                textStyle={{ color: '#000', fontSize: 18, fontFamily: 'Sen' }}
                placeHolderTextStyle={{ color: "#000" }}
                onDateChange={setDate}
                disabled={false}
              />
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>Time:</BoldText>
            <Button bordered
              onPress={() => timePickerRef.current.open()}
              style={styles.timePickerBtn}>
              <Text style={{ fontSize: 18, paddingHorizontal: 5 }}>{time ? moment(`${time.hour}:${time.minute}`, 'HH:mm').format('HH:mm') : 'Choose Time'}</Text>
            </Button>
          </Left>
        </View>

        <TimePicker
          ref={timePickerRef}
          onCancel={() => timePickerRef.current.close()}
          onConfirm={handlePickerConfirm}
        />

        <View style={styles.inviteSection}>
          <Button block rounded success style={styles.inviteBtn} disabled={!selectedPrayer || !description || !time} onPress={submit}>
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
  participantsSection: {
    paddingHorizontal: 15,
  },
  participantsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  numberText: {
    marginHorizontal: 10
  },
  sectionHeader: {
    fontSize: 16,
    marginBottom: 10
  },
  sectionSubHeader: {
    fontSize: 14,
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
    minWidth: 150,
    paddingHorizontal: 15
  },
  datePicker: {
    borderStyle: 'solid',
    borderColor: '#7C7C7C',
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 170,
    alignItems: 'center'
  },
  timePickerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 170,
    paddingHorizontal: 10,
    borderColor: '#7C7C7C',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  operationBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#7C7C7C',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 100,
    marginHorizontal: 10
  },
  operationText: {
    fontSize: 14
  }
})