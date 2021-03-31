import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useSnackbar } from '@/contexts/snackbar';
import SnackBar from 'react-native-snackbar-component';
import { Feather } from '@expo/vector-icons';
import { Text, BoldText, Touchable } from '@/components';
import { auth } from '@/firebase';
import { MAN_AVATAR, WOMAN_AVATAR, WAVE } from '@/assets/images';
import { initUser, setFullName, setInvitedAmount, setParticipatedAmount } from '@/actions/user';
import { ListItem } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import i18n from 'i18next';
import colors from '@/constants/colors';
import { updateUserName } from '@/services/user';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import { useUserInfo } from '@/hooks/redux';
import { deleteDeviceToken } from '@/services/device-token';
import { getInvitedAmount, getParticipatedAmount } from '@/services/prayer';
import { logEvent } from 'expo-firebase-analytics';
import useLogScreenView from '@/hooks/useLogScreenView';
import * as Device from 'expo-device';
import SelectGenderScreen from '@/screens/Auth/SelectGenderScreen';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function ProfileScreen({ navigation }: Props) {
  useLogScreenView('profile');
  const { t } = useTranslation(['PROFILE', 'SIGN', 'COMMON']);
  const user = useUserInfo();
  const dispatch = useDispatch();

  const [isTablet, setIsTablet] = useState(false);
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [currentFullName, setCurrentFullName] = useState(user.full_name);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();
  const [, setErrorMessage] = useSnackbar();

  useEffect(() => {
    (async () => {
      const device = await Device.getDeviceTypeAsync();
      if (device === Device.DeviceType.TABLET) {
        setIsTablet(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // Get the total amount of previously invited & participated, store in redux
      const invited = await getInvitedAmount(user.id);
      const participated = await getParticipatedAmount(user.id);

      dispatch(setInvitedAmount(invited.amount));
      dispatch(setParticipatedAmount(participated.amount));
    })();
  }, []);

  useEffect(() => {
    if (emailSentMessage.length) {
      setTimeout(
        () => {
          setEmailSentMessage('');
        },
        emailSentMessage.length > 30 ? 5000 : 3000
      );
    }
  }, [emailSentMessage]);

  function openActionSheet() {
    let subpath = '';
    switch (i18n.language) {
      case 'zh_hant':
        subpath = '/tw';
        break;
      case 'zh_hans':
        subpath = '/cn';
        break;
      case 'ar':
        subpath = '/ar';
        break;
      case 'ru':
        subpath = '/ru';
        break;
      case 'tr':
        subpath = '/tr';
        break;
      case 'fr':
        subpath = '/fr';
        break;
      case 'id':
        subpath = '/id';
        break;
      default:
        subpath = '';
    }
    showActionSheetWithOptions(
      {
        options: [
          t('OPTIONS.ABOUT'),
          t('OPTIONS.CONTACT'),
          t('OPTIONS.SUPPORT'),
          t('OPTIONS.FAQ'),
          t('OPTIONS.LANGUAGE'),
          t('OPTIONS.CANCEL'),
        ],
        title: '',
        message: '',
        cancelButtonIndex: 5,
        destructiveButtonIndex: 5,
        textStyle: { fontFamily: 'Sen', color: colors.primary },
        destructiveColor: colors.error,
      },
      (index) => {
        switch (index) {
          case 0:
            Linking.openURL(`https://wahd.app${subpath}/`);
            break;
          case 1:
            navigation.navigate('Contact');
            break;
          case 2:
            Linking.openURL(`https://wahd.app${subpath}/`);
            break;
          case 3:
            Linking.openURL(`https://wahd.app${subpath}/faq`);
            break;
          case 4:
            navigation.navigate('Language');
            break;
        }
      }
    );
  }

  function updateFullName(e) {
    if (currentFullName.length && currentFullName !== user.full_name) {
      updateUserName(currentFullName);
      dispatch(setFullName(currentFullName));
    }
    setIsEditingFullName(false);
  }

  function logout() {
    deleteDeviceToken(); // no need to await
    auth.signOut();
    AsyncStorage.removeItem('prayersFilter');
    dispatch(initUser());
  }

  function handleInvitedPress() {
    if (!user.invitedAmount) {
      return null;
    } else {
      navigation.navigate('Invited');
    }
  }

  function handleParticipatedPress() {
    if (!user.participatedAmount) {
      return null;
    } else {
      navigation.navigate('Participated');
    }
  }

  async function handleChangePassword() {
    if (!passwordEmailSent) {
      try {
        setPasswordEmailSent(true);
        await auth.sendPasswordResetEmail(user.email);
        logEvent('reset_password', { status: 'success' });
        setEmailSentMessage('An email has been sent to your inbox.');
      } catch (e) {
        logEvent('reset_password', { status: 'failure' });
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <LinearGradient
          style={styles.profileHeader}
          start={[1, 1]}
          end={[-1, -1]}
          colors={[colors.primary, colors.primary]}
        >
          <View style={styles.screenHeader}>
            <TouchableOpacity style={{ marginRight: 20 }} onPress={openActionSheet}>
              <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profilePicContainer}>
            <Image
              source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR}
              style={{ width: 60, height: 60 }}
            />
          </View>

          <View style={styles.nameContainer}>
            <BoldText style={styles.nameText}>{user.full_name}</BoldText>
          </View>
        </LinearGradient>

        {isTablet ? (
          <View style={{ marginBottom: 20 }} />
        ) : (
          <Image source={WAVE} style={{ width: '100%', height: 60, marginBottom: 0 }} />
        )}

        <View style={[styles.infoSection, { marginTop: 0 }]}>
          <View style={styles.infoContainer}>
            <View>
              <Touchable style={styles.infoItem} onPress={handleInvitedPress}>
                <BoldText style={styles.infoNumber}>{user.invitedAmount}</BoldText>
                <Text style={styles.infoLabel}>{t('PRAYERS_INVITED')}</Text>
              </Touchable>
            </View>

            <View>
              <Touchable style={styles.infoItem} onPress={handleParticipatedPress}>
                <BoldText style={styles.infoNumber}>{user.participatedAmount}</BoldText>
                <Text style={styles.infoLabel}>{t('PRAYERS_PARTICIPATED')}</Text>
              </Touchable>
            </View>
          </View>
        </View>
        <View style={styles.accountSection}>
          <View style={styles.accountRow}>
            <Text style={styles.label}>{t('SIGN:FULL_NAME')}</Text>
            {isEditingFullName ? (
              <TextInput
                onBlur={updateFullName}
                defaultValue={user.full_name}
                value={currentFullName}
                onChangeText={setCurrentFullName}
                style={styles.textInput}
                autoFocus={true}
              />
            ) : (
              <View style={styles.fieldWrapper}>
                <Text style={styles.textField}>{user.full_name}</Text>
                <Touchable onPress={() => setIsEditingFullName(true)}>
                  <Feather style={{ color: '#7F7F7F' }} name="edit-2" size={24} />
                </Touchable>
              </View>
            )}
          </View>

          <View style={styles.accountRow}>
            <Text style={styles.label}>{t('SIGN:EMAIL')}</Text>
            <Text style={styles.textField}>{user.email}</Text>
          </View>

          <View style={styles.accountRow}>
            <Text style={styles.label}>{t('COMMON:GENDER.LABEL')}</Text>
            <Text style={styles.textField}>
              {user.gender === 'M' ? t('COMMON:GENDER.MALE') : t('COMMON:GENDER.FEMALE')}
            </Text>
          </View>
        </View>

        <View style={styles.sessionSection}>
          <Touchable>
            <ListItem
              onPress={handleChangePassword}
              style={{ flexDirection: 'row', justifyContent: 'center' }}
            >
              <Text
                style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}
              >
                {t('CHANGE_PASSWORD')}
              </Text>
              <Feather style={{ marginLeft: 10, color: colors.primary }} name="lock" size={24} />
            </ListItem>
          </Touchable>
          <Touchable>
            <ListItem onPress={logout} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text
                style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}
              >
                {t('LOGOUT')}
              </Text>
              <Feather style={{ marginLeft: 10, color: colors.primary }} name="log-out" size={24} />
            </ListItem>
          </Touchable>
        </View>

        <View style={{ marginVertical: 15 }}>
          {/* <Touchable>
            <Text style={styles.footerText}>{t('DELETE_ACCOUNT')}</Text>
          </Touchable> */}
          <Touchable onPress={() => Linking.openURL(`https://wahd.app/privacy`)}>
            <Text style={styles.footerText}>{t('OPTIONS.PRIVACY')}</Text>
          </Touchable>
        </View>
      </ScrollView>

      <SnackBar
        visible={!!emailSentMessage.length}
        textMessage={emailSentMessage}
        backgroundColor={colors.primary}
        actionText="OK"
        actionHandler={() => setEmailSentMessage('')}
        accentColor="#fff"
      />
    </>
  );
}

const styles = StyleSheet.create({
  screenHeader: {
    marginTop: Platform.OS === 'ios' ? 28 : 24,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 25,
    width: '100%',
  },
  profilePicContainer: {
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  nameText: {
    fontSize: 18,
    color: '#fff',
  },
  infoSection: {
    marginTop: 25,
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15,
  },
  infoItem: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
  },
  infoNumber: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    textTransform: 'uppercase',
    color: '#000',
    fontSize: 10,
    textAlign: 'center',
  },
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 250,
  },
  panel: {
    backgroundColor: '#fff',
    height: 600,
  },
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  accountSection: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 25,
  },
  accountRow: {
    width: '100%',
    marginBottom: 20,
  },
  fieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  textField: {
    marginLeft: 10,
    letterSpacing: 0.9,
    fontSize: 14,
    color: '#000',
  },
  textInput: {
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 0.9,
    fontSize: 14,
    paddingLeft: -10,
  },
  sessionSection: {
    marginVertical: 25,
    padding: 0,
  },
  footerText: {
    paddingVertical: 8,
    color: '#7F7F7F',
    fontSize: 12,
    textAlign: 'center',
  },
});
