import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSnackbar } from '@/contexts/snackbar';
import { Text, BoldText, Touchable, Loader, RoundButton } from '@/components';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';
import { prayerTypes } from '@/constants/prayers';
import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createPrayer } from '@/services/prayer';
import { addInvitedAmount } from '@/actions/user';
import i18n from '../../i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { RouteProp } from '@react-navigation/native';
import { useUserInfo } from '@/hooks/redux';
import useLogScreenView, { logEvent } from '@/hooks/useLogScreenView';

type CreateInvitationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateInvitation'
>;

type CreateInvitationScreenRouteProp = RouteProp<RootStackParamList, 'CreateInvitation'>;

type Props = {
  route: CreateInvitationScreenRouteProp;
  navigation: CreateInvitationScreenNavigationProp;
};

export default function CreateInvitationScreen({ route, navigation }: Props) {
  useLogScreenView('create_invitation');
  const { t } = useTranslation(['INVITATION', 'COMMON']);
  const [, setErrorMessage] = useSnackbar();
  const dispatch = useDispatch();

  const [selectedPrayer, setSelectedPrayer] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [male, setMale] = useState(0);
  const [female, setFemale] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const user = useUserInfo();
  const PRAYERS = t('COMMON:PRAYERS', { returnObjects: true });

  const isComplete = useMemo(() => !!selectedPrayer.length && !!placeName.length && !!time, [
    selectedPrayer,
    placeName,
    time,
  ]);

  function handlePrayerClick(prayer) {
    if (selectedPrayer === prayer) {
      setSelectedPrayer('');
    } else {
      setSelectedPrayer(prayer);
    }
  }

  function handleDatePickerConfirm(date) {
    setIsDatePickerVisible(false);
    setDate(date);
  }

  function handleTimePickerConfirm(date) {
    setIsTimePickerVisible(false);
    setTime({ hour: dayjs(date).format('HH'), minute: dayjs(date).format('mm') });
  }

  function handleOperation(gender, operator) {
    if (gender === 'M') {
      if (operator === '+') {
        setMale((prev) => prev + 1);
      } else if (male > 0) {
        setMale((prev) => prev - 1);
      }
    } else {
      if (operator === '+') {
        setFemale((prev) => prev + 1);
      } else if (female > 0) {
        setFemale((prev) => prev - 1);
      }
    }
  }

  async function submit() {
    try {
      setIsLoading(true);
      // validate date time
      const now = dayjs();
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const schedule = dayjs(`${formattedDate} ${time.hour}:${time.minute}`, 'YYYY-MM-DD HH:mm');
      const formattedSchedule = schedule.format();

      if (now > schedule) {
        throw { message: t('ERROR.0') };
      }

      const { latitude, longitude, removeMarker } = route.params;

      const payload = {
        schedule_time: formattedSchedule,
        selected_prayer: selectedPrayer,
        placeName,
        description,
        lat: latitude,
        lng: longitude,
        guests: {
          male,
          female,
        },
      };

      const id = await createPrayer(payload);
      logEvent('create_invitation', { status: 'success', selected_prayer: selectedPrayer });

      setIsLoading(false);
      removeMarker();

      const params = {
        schedule_time: payload.schedule_time,
        prayer: payload.selected_prayer,
        place: payload.placeName,
        description: payload.description,
        location: {
          lat: payload.lat,
          lng: payload.lng,
        },
        guests_male: payload.guests.male,
        guests_female: payload.guests.female,
        inviter: user,
        participants: [],
        id,
      };

      dispatch(addInvitedAmount());

      navigation.goBack();
      navigation.navigate('PrayerDetail', params);
    } catch (e) {
      logEvent('create_invitation', { status: 'failure' });
      setIsLoading(false);
      if (e.message) {
        setErrorMessage(e.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        {isLoading && <Loader />}
        <View style={{ paddingVertical: 20, height: '100%', width: '100%' }}>
          <View style={styles.detailSection}>
            <BoldText style={[styles.sectionHeader, { marginBottom: 5 }]}>{t('PRAYER')} *</BoldText>
            <FlatList
              style={{ width: '100%', paddingTop: 5, paddingLeft: 25 }}
              contentContainerStyle={{ paddingRight: 45 }}
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
                    borderRadius: 20,
                  }}
                  backgroundColor={selectedPrayer === item ? colors.primary : '#fff'}
                  textStyle={{
                    textTransform: 'capitalize',
                    color: selectedPrayer === item ? '#fff' : '#dedede',
                  }}
                >
                  {PRAYERS[item]}
                </RoundButton>
              )}
              keyExtractor={(item) => item}
            />
          </View>

          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>{t('CURRENT_PARTICIPANTS')}</BoldText>
          </View>
          <View style={styles.participantsSection}>
            {user.gender === 'M' && (
              <View style={styles.participantsRow}>
                <View>
                  <Text style={styles.sectionSubHeader}>{t('COMMON:GENDER.MALE')}</Text>
                </View>
                <View style={styles.counter}>
                  <TouchableOpacity
                    onPress={() => handleOperation('M', '-')}
                    style={{ position: 'relative', left: 60 }}
                  >
                    <View style={[styles.operationBtn, { paddingLeft: 8 }]}>
                      <Text style={styles.operationText}>-</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.numberBtn}>
                    <Text style={{ minWidth: 30, textAlign: 'center', color: colors.primary }}>
                      {male}
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => handleOperation('M', '+')}>
                    <View
                      style={[styles.operationBtn, { alignItems: 'flex-end', paddingRight: 8 }]}
                    >
                      <Text style={styles.operationText}>+</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.participantsRow}>
              <View>
                <Text style={styles.sectionSubHeader}>{t('COMMON:GENDER.FEMALE')}</Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => handleOperation('F', '-')}
                  style={{ position: 'relative', left: 60 }}
                >
                  <View style={[styles.operationBtn, { paddingLeft: 8 }]}>
                    <Text style={styles.operationText}>-</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.numberBtn}>
                  <Text style={{ minWidth: 30, textAlign: 'center', color: colors.primary }}>
                    {female}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleOperation('F', '+')}>
                  <View style={[styles.operationBtn, { alignItems: 'flex-end', paddingRight: 8 }]}>
                    <Text style={styles.operationText}>+</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>{t('DATE')} *</BoldText>
            <Touchable
              onPress={() => setIsDatePickerVisible(true)}
              style={{
                width: '100%',
                paddingHorizontal: 25,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="calendar" size={18} color={colors.primary} />
                <Text style={{ paddingLeft: 15, color: '#7C7C7C' }}>
                  {dayjs(date).format('YYYY-MM-DD')}
                </Text>
              </View>
              <View>
                <Feather name="chevron-right" size={18} color="#7C7C7C" />
              </View>
            </Touchable>
          </View>

          <View style={styles.detailSection}>
            <BoldText style={styles.sectionHeader}>{t('TIME')} *</BoldText>
            <Touchable
              onPress={() => setIsTimePickerVisible(true)}
              style={{
                width: '100%',
                paddingHorizontal: 25,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="clock" size={18} color={colors.primary} />
                <Text style={{ paddingLeft: 15, color: '#7C7C7C' }}>
                  {time ? `${time.hour}:${time.minute}` : t('CHOOSE_TIME')}
                </Text>
              </View>
              <View>
                <Feather name="chevron-right" size={18} color="#7C7C7C" />
              </View>
            </Touchable>
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

          <View style={[styles.detailSection, { paddingHorizontal: 25 }]}>
            <BoldText style={[styles.sectionHeader, { paddingLeft: 0 }]}>{t('PLACE')} *</BoldText>
            <TextInput
              style={styles.input}
              placeholderTextColor="#ccc"
              placeholder={t('PLACE_PLACEHOLDER')}
              maxLength={40}
              onChangeText={setPlaceName}
              value={placeName}
              returnKeyType="done"
            />
          </View>

          <View style={[styles.detailSection, { paddingHorizontal: 25 }]}>
            <BoldText style={[styles.sectionHeader, { paddingLeft: 0 }]}>
              {t('DESCRIPTION')}
            </BoldText>
            <TextInput
              multiline={true}
              numberOfLines={6}
              onChangeText={setDescription}
              value={description}
              style={styles.textArea}
              placeholderTextColor="#ccc"
              placeholder={t('PLACEHOLDER')}
            />
          </View>

          <View style={{ marginTop: 20, paddingHorizontal: 25 }}>
            <Touchable disabled={!isComplete} onPress={submit} style={styles.inviteTouchable}>
              <View
                style={{
                  ...styles.inviteBtn,
                  backgroundColor: isComplete ? colors.primary : '#dedede',
                  borderColor: isComplete ? colors.primary : '#dedede',
                  borderWidth: isComplete ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: 1.8,
                    color: '#ffffff',
                  }}
                >
                  {t('INVITE')}
                </Text>
              </View>
            </Touchable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 18,
    color: '#7C7C7C',
    textTransform: 'capitalize',
  },
  prayerBtn: {
    borderRadius: 25,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40,
    marginBottom: 15,
    marginRight: 10,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
  },
  detailSection: {
    paddingVertical: 15,
  },
  participantsSection: {
    paddingRight: 15,
  },
  participantsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  numberText: {
    marginHorizontal: 10,
  },
  sectionHeader: {
    paddingLeft: 25,
    fontSize: 14,
    marginBottom: 10,
    color: '#7C7C7C',
  },
  sectionSubHeader: {
    paddingLeft: 25,
    fontSize: 14,
    color: '#7C7C7C',
  },
  prayerList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  inviteTouchable: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  numberBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    position: 'relative',
    zIndex: 3,
    left: 30,
  },
  operationBtn: {
    justifyContent: 'center',
    width: 65,
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 100,
    position: 'relative',
    zIndex: 2,
  },
  operationText: {
    fontSize: 26,
    color: '#fff',
  },
  input: {
    fontFamily: 'Sen',
    borderWidth: 0,
    fontSize: 14,
    lineHeight: 22,
  },
  textArea: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#dedede',
    fontFamily: 'Sen',
    paddingVertical: 10,
    paddingLeft: 0,
    textAlignVertical: 'top',
    height: 150,
    justifyContent: 'flex-start',
    fontSize: 12,
    lineHeight: 22,
  },
});
