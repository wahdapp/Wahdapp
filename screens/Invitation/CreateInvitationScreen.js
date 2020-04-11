import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import TimePicker from 'react-native-24h-timepicker';
import { View, Left, Right, Button, Toast, Textarea, DatePicker } from 'native-base';
import { Text, BoldText, Touchable } from 'components';
import moment from 'moment';
import { db, auth, GeoPoint } from 'firebaseDB';
import { prayerTypes } from 'constants/prayers';
import geohash from 'ngeohash';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from 'constants/Colors';

export default function CreateInvitationScreen({ route, navigation }) {
  const { t } = useTranslation(['INVITATION', 'COMMON']);
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const timePickerRef = useRef(null);
  const user = useSelector(state => state.userState);
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  const isComplete = useMemo(() => selectedPrayer && description && time, [selectedPrayer, description, time]);

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
      setIsLoading(true);
      // validate date time
      const now = moment();
      const formattedDate = moment(date).format('YYYY-DD-MM');
      const schedule = moment(`${formattedDate} ${time.hour}:${time.minute}`, 'YYYY-DD-MM HH:mm');
      const formattedSchedule = schedule.format();

      if (now > schedule) {
        throw { message: t('ERROR.0') };
      }

      const { latitude, longitude, removeMarker } = route.params;

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
        },
        gender: user.gender
      });

      setIsLoading(true);

      navigation.pop(2);
      removeMarker();
    }
    catch (e) {
      setIsLoading(false);
      if (e.message) {
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
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={{ color: '#fff' }}
      />
      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('PRAYER')}</BoldText>
            <FlatList
              style={{ width: '100%' }}
              horizontal={true}
              data={prayerTypes}
              renderItem={({ item }) => (
                <Touchable onPress={() => handlePrayerClick(item)}>
                  <View style={{
                    ...styles.prayerBtn,
                    borderWidth: selectedPrayer === item ? 0 : 2,
                    borderColor: selectedPrayer === item ? null : '#dedede',
                    backgroundColor: selectedPrayer === item ? colors.primary : '#fff'
                  }}>
                    <Text style={{ textTransform: 'capitalize', color: selectedPrayer === item ? '#fff' : '#dedede' }}>{PRAYERS[item]}</Text>
                  </View>
                </Touchable>
              )}
              keyExtractor={item => item}
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('CURRENT_PARTICIPANTS')}</BoldText>
          </Left>
        </View>
        <View style={styles.participantsSection}>
          <View style={styles.participantsRow}>
            <View>
              <Text style={styles.sectionSubHeader}>{t('COMMON:GENDER.MALE')}</Text>
            </View>
            <View style={styles.counter}>
              <Touchable onPress={() => handleOperation('M', '-')}>
                <View style={styles.operationBtn}>
                  <Text style={styles.operationText}>-</Text>
                </View>
              </Touchable>
              <Text style={{ minWidth: 30, textAlign: 'center', color: colors.primary }}>{male}</Text>
              <Touchable onPress={() => handleOperation('M', '+')}>
                <View style={styles.operationBtn}>
                  <Text style={styles.operationText}>+</Text>
                </View>
              </Touchable>
            </View>
          </View>
          <View style={styles.participantsRow}>
            <View>
              <Text style={styles.sectionSubHeader}>{t('COMMON:GENDER.FEMALE')}</Text>
            </View>
            <View style={styles.counter}>
              <Touchable onPress={() => handleOperation('F', '-')}>
                <View style={styles.operationBtn}>
                  <Text style={styles.operationText}>-</Text>
                </View>
              </Touchable>
              <Text style={{ minWidth: 30, textAlign: 'center', color: colors.primary }}>{female}</Text>
              <Touchable onPress={() => handleOperation('F', '+')}>
                <View style={styles.operationBtn}>
                  <Text style={styles.operationText}>+</Text>
                </View>
              </Touchable>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('DESCRIPTION')}</BoldText>
            <Textarea
              value={description}
              onChangeText={setDescription}
              style={{ width: '100%', borderBottomWidth: 1, borderColor: '#dedede', fontFamily: 'Sen', paddingVertical: 10, paddingLeft: 0 }}
              placeholderTextColor="#dedede"
              placeholder={t('PLACEHOLDER')}
              rowSpan={4}
            />
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('DATE')}</BoldText>
            <View style={styles.datePicker}>
              <DatePicker
                defaultDate={new Date()}
                minimumDate={new Date()}
                locale={"en"}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText={moment(date).format('YYYY-MM-DD')}
                formatChosenDate={d => moment(d).format('YYYY-MM-DD')}
                textStyle={{ color: '#fff', fontSize: 18, fontFamily: 'Sen' }}
                placeHolderTextStyle={{ color: '#fff' }}
                onDateChange={setDate}
                disabled={false}
              />
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('TIME')}</BoldText>
            <Touchable onPress={() => timePickerRef.current.open()}>
              <View style={styles.timePickerBtn}>
                <Text style={{ fontSize: 18, paddingHorizontal: 5, color: '#fff' }}>{time ? moment(`${time.hour}:${time.minute}`, 'HH:mm').format('HH:mm') : t('CHOOSE_TIME')}</Text>
              </View>
            </Touchable>
          </Left>
        </View>

        <TimePicker
          ref={timePickerRef}
          onCancel={() => timePickerRef.current.close()}
          onConfirm={handlePickerConfirm}
        />

        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <Touchable
            style={{
              ...styles.inviteBtn,
              backgroundColor: isComplete ? colors.primary : '#dedede',
              borderColor: isComplete ? colors.primary : '#dedede',
              borderWidth: isComplete ? 2 : 0,
            }}
            disabled={!isComplete}
            onPress={submit}>
            <Text style={{
              fontSize: 14,
              letterSpacing: 1.8,
              color: '#ffffff'
            }}>{t('INVITE')}</Text>
          </Touchable>
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
    borderRadius: 25,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 15,
    marginRight: 10
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
    marginBottom: 10,
    color: '#7C7C7C',
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
  inviteBtn: {
    height: 52,
    width: '100%',
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: colors.primary
  },
  datePicker: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 170,
    alignItems: 'center'
  },
  timePickerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 170,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    height: 42
  },
  operationBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginHorizontal: 10
  },
  operationText: {
    fontSize: 18,
    color: '#fff'
  }
})