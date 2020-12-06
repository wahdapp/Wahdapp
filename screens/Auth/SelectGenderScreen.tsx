import React, { useState, Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { BoldText, RoundButton, Loader, GenderBox } from '@/components';
import { auth } from '@/firebase';
import { setUser, initializeFilter, setDeviceToken } from '@/actions';
import { useTranslation } from 'react-i18next';
import { createUser } from '@/services/user';
import { registerToken } from '@/services/device-token';
import { Notifications } from 'expo';
import * as Animatable from 'react-native-animatable';
import colors from '@/constants/colors';

type Props = {
  setIsFirstOAuth: Dispatch<SetStateAction<boolean>>;
  setUserDataFetched: Dispatch<SetStateAction<boolean>>;
};

function SelectGenderScreen({ setIsFirstOAuth, setUserDataFetched }: Props) {
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
    setIsCreating(true);

    const user = {
      full_name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      gender,
      locale: 'en',
    };

    await createUser({
      uid: auth.currentUser.uid,
      ...user,
    });

    dispatch(setUser(user));
    dispatch(initializeFilter(gender));
    setIsCreating(false);

    setIsFirstOAuth(false);
    setUserDataFetched(true);

    await registerPushToken();
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
            touchableStyle={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}
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
