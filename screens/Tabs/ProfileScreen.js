import React, { useState, useLayoutEffect, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, AsyncStorage, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SnackbarContext } from 'contexts/snackbar';
import SnackBar from 'react-native-snackbar-component';
import { Feather } from '@expo/vector-icons';
import { Text, BoldText, Touchable } from 'components';
import { auth, db } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR, WAVE } from 'assets/images';
import { setFullName } from 'actions';
import { ListItem } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import i18n from 'i18next';
import * as Animatable from 'react-native-animatable';
import colors from 'constants/Colors';
import { updateUserName } from 'services/user';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation(['PROFILE', 'SIGN', 'COMMON']);
  const user = useSelector(state => state.userState);
  const dispatch = useDispatch();

  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [currentFullName, setCurrentFullName] = useState(user.full_name);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  const [emailSentMessage, setEmailSentMessage] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();
  const { setErrorMessage } = useContext(SnackbarContext);

  useEffect(() => {
    if (emailSentMessage.length) {
      setTimeout(() => {
        setEmailSentMessage('');
      }, emailSentMessage.length > 30 ? 5000 : 3000)
    }
  }, [emailSentMessage]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={openActionSheet}>
          <Feather name="menu" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  function openActionSheet() {
    let subpath = '';
    switch (i18n.language) {
      case 'zh_hant':
        subpath = '/tw';
        break;
      case 'zh_hans':
        subpath = '/cn';
        break;
      default: subpath = '';
    }
    showActionSheetWithOptions({
      options: [t('OPTIONS.ABOUT'), t('OPTIONS.CONTACT'), t('OPTIONS.DONATE'), t('OPTIONS.FAQ'), t('OPTIONS.LANGUAGE'), t('OPTIONS.CANCEL')],
      title: '',
      message: '',
      cancelButtonIndex: 5,
      destructiveButtonIndex: 5,
      textStyle: { fontFamily: 'Sen', color: colors.primary },
      destructiveColor: colors.error
    }, index => {
      switch (index) {
        case 0:
          Linking.openURL(`https://wahd.app${subpath}/about`)
          break;
        case 1:
          navigation.navigate('Contact')
          break;
        case 2:
          Linking.openURL('https://www.paypal.me/abdullahcheng')
          break;
        case 3:
          Linking.openURL(`https://wahd.app${subpath}/faq`)
          break;
        case 4:
          navigation.navigate('Language')
          break;
      }
    });
  }

  function updateFullName(e) {
    if (currentFullName.length && currentFullName !== user.full_name) {
      updateUserName(currentFullName);
      dispatch(setFullName(currentFullName));
    }
    setIsEditingFullName(false);
  }

  function logout() {
    auth.signOut();
    AsyncStorage.removeItem('prayersFilter');
  }

  function handleInvitedPress() {
    if (!user.invitedAmount) {
      return null;
    }
    else {
      navigation.navigate('Invited');
    }
  }

  function handleParticipatedPress() {
    if (!participatedAmount) {
      return null;
    }
    else {
      navigation.navigate('Participated');
    }
  }

  async function handleChangePassword() {
    if (!passwordEmailSent) {
      try {
        setPasswordEmailSent(true);
        await auth.sendPasswordResetEmail(user.email);
        setEmailSentMessage('An email has been sent to your inbox.');
      }
      catch (e) {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <LinearGradient style={styles.profileHeader} start={[1, 1]} end={[-1, -1]} colors={[colors.primary, colors.primary]}>
          <View style={styles.screenHeader}>
            <TouchableOpacity style={{ marginRight: 15, paddingLeft: 25 }} onPress={openActionSheet}>
              <Feather name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Animatable.View animation="bounceIn" delay={300} style={styles.profilePicContainer}>
            <Image source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 60, height: 60 }} />
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={600} style={styles.nameContainer}>
            <BoldText style={styles.nameText}>{user.full_name}</BoldText>
          </Animatable.View>

        </LinearGradient>

        <Image source={WAVE} style={{ width: '100%', height: 60, marginBottom: 0 }} />

        <View style={[styles.infoSection, { marginTop: 0 }]}>
          <View style={styles.infoContainer}>
            <Animatable.View animation="bounceIn" delay={900}>
              <Touchable style={styles.infoItem} onPress={handleInvitedPress}>
                <BoldText style={styles.infoNumber}>{user.invitedAmount}</BoldText>
                <Text style={styles.infoLabel}>{t('PRAYERS_INVITED')}</Text>
              </Touchable>
            </Animatable.View>

            <Animatable.View animation="bounceIn" delay={1200}>
              <Touchable style={styles.infoItem} onPress={handleParticipatedPress}>
                <BoldText style={styles.infoNumber}>{user.participatedAmount}</BoldText>
                <Text style={styles.infoLabel}>{t('PRAYERS_PARTICIPATED')}</Text>
              </Touchable>
            </Animatable.View>
          </View>
        </View>
        <View style={styles.accountSection}>
          <Animatable.View animation="fadeInRight" delay={1700} style={styles.accountRow}>
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
                    <Feather
                      style={{ color: '#7F7F7F' }}
                      name="edit-2"
                      size={24}
                    />
                  </Touchable>
                </View>
              )}

          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={1950} style={styles.accountRow}>
            <Text style={styles.label}>{t('SIGN:EMAIL')}</Text>
            <Text style={styles.textField}>{user.email}</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInRight" delay={2200} style={styles.accountRow}>
            <Text style={styles.label}>{t('COMMON:GENDER.LABEL')}</Text>
            <Text style={styles.textField}>{user.gender === 'M' ? t('COMMON:GENDER.MALE') : t('COMMON:GENDER.FEMALE')}</Text>
          </Animatable.View>
        </View>

        <View style={styles.sessionSection}>
          <Touchable>
            <ListItem onPress={handleChangePassword} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}>{t('CHANGE_PASSWORD')}</Text>
              <Feather style={{ marginLeft: 10, color: colors.primary }} name="lock" size={24} />
            </ListItem>
          </Touchable>
          <Touchable>
            <ListItem onPress={logout} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}>{t('LOGOUT')}</Text>
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
  )
}

const styles = StyleSheet.create({
  screenHeader: {
    marginTop: 10,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 25,
    width: '100%'
  },
  profilePicContainer: {
    alignItems: 'center'
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 15
  },
  nameText: {
    fontSize: 18,
    color: '#fff'
  },
  infoSection: {
    marginTop: 25,
    width: '100%'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15
  },
  infoItem: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  infoNumber: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10
  },
  infoLabel: {
    textTransform: 'uppercase',
    color: '#000',
    fontSize: 10,
    textAlign: 'center'
  },
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 250
  },
  panel: {
    backgroundColor: '#fff',
    height: 600
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
    marginBottom: 20
  },
  fieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  label: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#000',
    color: colors.primary,
    textTransform: 'uppercase'
  },
  textField: {
    marginLeft: 10,
    letterSpacing: 0.9,
    fontSize: 14,
    color: '#000'
  },
  textInput: {
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 0.9,
    fontSize: 14,
    paddingLeft: -10
  },
  sessionSection: {
    marginVertical: 25,
    padding: 0
  },
  footerText: {
    paddingVertical: 8,
    color: '#7F7F7F',
    fontSize: 12,
    textAlign: 'center'
  }
})