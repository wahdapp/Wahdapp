import React, { Dispatch } from 'react';
import { WAVE } from '@/assets/images';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { BoldText, RoundButton, Text } from '@/components';
import colors from '@/constants/colors';

type Props = {
  setTip: Dispatch<React.SetStateAction<boolean>>;
};

const GetNotified: React.FC<Props> = ({ setTip }) => {
  async function verifyPermissions() {
    // Check user's permission statuses on notification & location
    const { status: notifStat } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    const { status: posStat } = await Permissions.getAsync(Permissions.LOCATION);

    if (notifStat === 'granted' && posStat === 'granted') {
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
          <BoldText style={styles.title}>Get Notified</BoldText>
          <Text style={styles.desc}>
            Please pick an area where you would like to receive notifications from. A notification
            will be sent to your device whenever there is a new prayer in the selected area.
          </Text>
        </View>
      </ScrollView>

      <View style={{ ...styles.buttonWrapper, bottom: 100 }}>
        <RoundButton
          onPress={verifyPermissions}
          style={{ width: '100%' }}
          touchableStyle={styles.touchableStyle}
        >
          Continue
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
          No Thanks
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
