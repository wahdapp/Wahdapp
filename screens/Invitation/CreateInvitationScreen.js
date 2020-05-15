import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import { View, Left, Toast, Textarea } from 'native-base';
import { Text, BoldText, Touchable, Loader, RoundButton } from 'components';
import moment from 'moment';
import { db, auth, GeoPoint } from 'firebaseDB';
import { prayerTypes } from 'constants/prayers';
import geohash from 'ngeohash';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import i18n from '../../i18n';

export default function CreateInvitationScreen({ route, navigation }) {
  const { t } = useTranslation(['INVITATION', 'COMMON']);
  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
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

  function handleDatePickerConfirm(date) {
    setIsDatePickerVisible(false);
    setDate(date);
  }

  function handleTimePickerConfirm(date) {
    setIsTimePickerVisible(false);
    setTime({ hour: moment(date).format('HH'), minute: moment(date).format('mm') });
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

  async function submit() {
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

      const payload = {
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
      }

      const docRef = await db.collection('prayers').add(payload);

      const { id } = docRef;

      setIsLoading(false);
      removeMarker();

      navigation.goBack();
      navigation.navigate('PrayerDetail', { ...payload, id, inviterID: auth.currentUser.uid, inviter: user });
    }
    catch (e) {
      setIsLoading(false);
      if (e.message) {
        Toast.show({
          text: e.message,
          textStyle: { fontSize: 12 },
          buttonText: 'OK',
          type: 'danger',
          duration: 3000
        });
      }
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <Loader />}
      <View style={{ padding: 20, height: '100%', width: '100%' }}>
        <View style={styles.detailSection}>
          <Left>
            <BoldText style={[styles.sectionHeader, { marginBottom: 5 }]}>{t('PRAYER')}</BoldText>
            <FlatList
              style={{ width: '100%', paddingTop: 5 }}
              horizontal={true}
              data={prayerTypes}
              renderItem={({ item }) => (
                <RoundButton
                  onPress={() => handlePrayerClick(item)}
                  style={{
                    backgroundColor: selectedPrayer === item ? colors.primary : '#fff',
                    width: null,
                    minWidth: 80,
                    paddingHorizontal: 20,
                    height: 40,
                    marginBottom: 15,
                    marginRight: 10,
                    borderRadius: 20
                  }}
                  colors={selectedPrayer === item ? [colors.primary, colors.secondary] : ['#fff', '#fff']}
                  textStyle={{ textTransform: 'capitalize', color: selectedPrayer === item ? '#fff' : '#dedede' }}
                >
                  {PRAYERS[item]}
                </RoundButton>
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
          {user.gender === 'M' && <View style={styles.participantsRow}>
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
          </View>}
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
              <Touchable onPress={() => setIsDatePickerVisible(true)} style={{ width: '100%' }}>
                <View style={styles.timePickerBtn}>
                  <Text style={{ fontSize: 18, paddingHorizontal: 5, color: '#fff' }}>{moment(date).format('YYYY-MM-DD')}</Text>
                </View>
              </Touchable>
            </View>
          </Left>
        </View>

        <View style={styles.detailSection}>
          <Left>
            <BoldText style={styles.sectionHeader}>{t('TIME')}</BoldText>
            <Touchable onPress={() => setIsTimePickerVisible(true)} style={{ width: '100%' }}>
              <View style={styles.timePickerBtn}>
                <Text style={{ fontSize: 18, paddingHorizontal: 5, color: '#fff' }}>{time ? moment(`${time.hour}:${time.minute}`, 'HH:mm').format('HH:mm') : t('CHOOSE_TIME')}</Text>
              </View>
            </Touchable>
          </Left>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          locale={i18n.language}
          onConfirm={handleDatePickerConfirm}
          onCancel={() => setIsDatePickerVisible(false)}
          headerTextIOS={t('CHOOSE_DATE')}
          cancelTextIOS={t('CANCEL')}
          confirmTextIOS={t('CONFIRM')}
        />

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          locale={i18n.language}
          onConfirm={handleTimePickerConfirm}
          onCancel={() => setIsTimePickerVisible(false)}
          headerTextIOS={t('CHOOSE_TIME')}
          cancelTextIOS={t('CANCEL')}
          confirmTextIOS={t('CONFIRM')}
        />

        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <Touchable
            disabled={!isComplete}
            onPress={submit}
            style={styles.inviteTouchable}
          >
            <LinearGradient
              style={{
                ...styles.inviteBtn,
                borderColor: isComplete ? colors.primary : '#dedede',
                borderWidth: isComplete ? 2 : 0,
              }}
              colors={isComplete ? [colors.primary, colors.secondary] : ['#dedede', '#dedede']}
              start={[0, 1]}
              end={[1, 0]}
            >
              <Text style={{
                fontSize: 14,
                letterSpacing: 1.8,
                color: '#ffffff'
              }}>{t('INVITE')}</Text>
            </LinearGradient>
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
  inviteTouchable: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  inviteBtn: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderRadius: 26,
  },
  datePicker: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  timePickerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  operationBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  },
  operationText: {
    fontSize: 18,
    color: '#fff'
  }
})