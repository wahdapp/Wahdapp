import React, { Dispatch } from 'react';
import { WAVE } from '@/assets/images';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { BoldText, RoundButton, Text } from '@/components';
import colors from '@/constants/colors';
import { useDispatch } from 'react-redux';
import { useUserInfo } from '@/hooks/redux';
import { setDeviceToken } from '@/actions/user';
import { registerToken } from '@/services/device-token';
import { useTranslation } from 'react-i18next';

type Props = {
  setTip: Dispatch<React.SetStateAction<boolean>>;
};

const GetNotified: React.FC<Props> = ({ setTip }) => {
  const user = useUserInfo();
  const dispatch = useDispatch();
  const { t } = useTranslation(['GET_NOTIFIED']);

  async function verifyPermissions() {
    // Check user's permission statuses on notification & location
    const { status: notifStat } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    const { status: posStat } = await Permissions.getAsync(Permissions.LOCATION);

    if (notifStat === 'granted' && posStat === 'granted') {
      // register device token if the user previously denied permission
      if (!user.device_token) {
        const token = await Notifications.getExpoPushTokenAsync();
        await registerToken(token);
        dispatch(setDeviceToken(token));
      }
      // let user choose area to be notified
      setTip(true);
    }
  }
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.waveHeader} />
        <Image source={WAVE} style={{ width: '100%', height: 60, marginBottom: 0 }} />
        <View style={styles.container}>
          <BoldText style={styles.title}>{t('TITLE')}</BoldText>
          <Text style={styles.desc}>{t('DESC')}</Text>
        </View>
      </ScrollView>

      <View style={{ ...styles.buttonWrapper, bottom: 100 }}>
        <RoundButton
          onPress={verifyPermissions}
          style={{ width: '100%' }}
          touchableStyle={styles.touchableStyle}
        >
          {t('CONTINUE')}
        </RoundButton>
      </View>

      <View style={{ ...styles.buttonWrapper, bottom: 25 }}>
        <RoundButton
          style={{ width: '100%' }}
          backgroundColor="#fff"
          textStyle={{ color: '#7D7D7D' }}
          touchableStyle={styles.touchableStyle}
          onPress={() => setTip(false)}
        >
          {t('NO_THANKS')}
        </RoundButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  waveHeader: {
    backgroundColor: colors.primary,
    height: 45,
    width: '100%',
  },
  title: {
    fontSize: 32,
    color: '#000',
    letterSpacing: 1.2,
    marginTop: 20,
  },
  desc: {
    marginTop: 20,
    fontSize: 12,
    letterSpacing: 1.2,
    lineHeight: 22,
  },
  buttonWrapper: {
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
  },
  touchableStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default GetNotified;
