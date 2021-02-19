import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { BoldText, RoundButton, Loader, GenderBox } from '@/components';
import { auth } from '@/firebase';
import { setUser, setDeviceToken } from '@/actions/user';
import { initializeFilter } from '@/actions/filter';
import { useTranslation } from 'react-i18next';
import { createUser } from '@/services/user';
import { registerToken } from '@/services/device-token';
import { Notifications } from 'expo';
import * as Animatable from 'react-native-animatable';
import colors from '@/constants/colors';
import { logEvent } from 'expo-firebase-analytics';
import useLogScreenView from '@/hooks/useLogScreenView';
import i18n from 'i18next';

function SelectGenderScreen() {
  useLogScreenView('select_gender');
  const [isCreating, setIsCreating] = useState(false);
  const [gender, setGender] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation(['SIGN', 'COMMON']);

  async function registerPushToken() {
    const token = await Notifications.getExpoPushTokenAsync();
    await registerToken(token);

    dispatch(setDeviceToken(token));
  }

  async function chooseGender() {
    try {
      setIsCreating(true);

      const user = {
        full_name:
          auth.currentUser.displayName ?? auth.currentUser.providerData[0].email.split('@')[0],
        email: auth.currentUser.email ?? auth.currentUser.providerData[0].email,
        gender,
        locale: i18n.language,
      };

      await createUser({
        uid: auth.currentUser.uid,
        ...user,
      });

      logEvent('select_gender', { gender });

      dispatch(setUser(user));
      dispatch(initializeFilter(gender));
      setIsCreating(false);

      await registerPushToken();
    } catch (e) {
      setIsCreating(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      {isCreating && <Loader />}
      <BoldText style={styles.header}>{t('CHOOSE_GENDER')}</BoldText>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <GenderBox
          label={t('COMMON:GENDER.MALE')}
          gender="M"
          onPress={() => setGender('M')}
          isSelected={gender === 'M'}
        />
        <GenderBox
          label={t('COMMON:GENDER.FEMALE')}
          gender="F"
          onPress={() => setGender('F')}
          isSelected={gender === 'F'}
        />
      </View>

      {gender.length > 0 && (
        <Animatable.View animation="pulse" iterationCount="infinite" style={styles.buttonWrapper}>
          <RoundButton
            onPress={chooseGender}
            style={{ maxWidth: 300 }}
            touchableStyle={{ flexDirection: 'row', justifyContent: 'center' }}
          >
            {t('COMMON:GENDER.CONFIRM')}
          </RoundButton>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginVertical: 25,
    letterSpacing: 1.8,
    padding: 25,
    color: colors.primary,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 25,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default SelectGenderScreen;
