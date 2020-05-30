import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, AsyncStorage, Platform, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text, BoldText, Touchable } from 'components';
import { auth, db } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import { setFullName } from 'actions';
import { ListItem } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@expo/react-native-action-sheet';
import i18n from 'i18next';
import colors from 'constants/Colors';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation(['PROFILE', 'SIGN', 'COMMON']);
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [invitedPrayersList, setInvitedPrayersList] = useState([]);
  const [participatedList, setParticipatedList] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState);
  const [currentFullName, setCurrentFullName] = useState(user.fullName);
  const { showActionSheetWithOptions } = useActionSheet();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 25, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={openActionSheet}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      getPastInfo();
    }
  }, [user]);

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
      textStyle: { fontFamily: 'Sen', color: colors.primary }
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

  async function getPastInfo() {
    const invitedDoc = await db.collection('prayers')
      .where('inviter', '==', db.doc('users/' + auth.currentUser.uid))
      .get();

    const participatedDoc = await db.collection('prayers')
      .where('participants', 'array-contains', db.doc('users/' + auth.currentUser.uid))
      .get();

    setInvitedPrayersList(invitedDoc);
    setParticipatedList(participatedDoc);
  }

  function updateFullName(e) {
    if (currentFullName.length && currentFullName !== user.fullName) {
      db.collection('users').doc(auth.currentUser.uid).set({ fullName: currentFullName }, { merge: true });
      dispatch(setFullName(currentFullName));
    }
    setIsEditingFullName(false);
  }

  function logout() {
    auth.signOut();
    AsyncStorage.removeItem('prayersFilter');
  }

  function handleInvitedPress() {
    if (!invitedPrayersList.size) {
      return null;
    }
    else {
      navigation.navigate('Invited', { invitedPrayersList, inviterID: auth.currentUser.uid, inviter: user });
    }
  }

  function handleParticipatedPress() {
    if (!participatedList.size) {
      return null;
    }
    else {
      navigation.navigate('Invited', { participatedList, inviterID: auth.currentUser.uid, inviter: user });
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <LinearGradient style={styles.profileHeader} start={[1, 1]} end={[-1, -1]} colors={[colors.secondary, colors.primary]}>
          <View style={styles.screenHeader}>
            <TouchableOpacity style={{ marginRight: 25, paddingLeft: 25 }} onPress={openActionSheet}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profilePicContainer}>
            <Image source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 75, height: 75 }} />
          </View>

          <View style={styles.nameContainer}>
            <BoldText style={styles.nameText}>{user.fullName}</BoldText>
          </View>
        </LinearGradient>
        <View style={[styles.infoSection, { marginTop: 0 }]}>
          <View style={styles.infoContainer}>
            <Touchable style={styles.infoItem} onPress={handleInvitedPress}>
              <BoldText style={styles.infoNumber}>{invitedPrayersList.size ? invitedPrayersList.size : 0}</BoldText>
              <Text style={styles.infoLabel}>{t('PRAYERS_INVITED')}</Text>
            </Touchable>
            <Touchable style={styles.infoItem} onPress={handleParticipatedPress}>
              <BoldText style={styles.infoNumber}>{participatedList.size ? participatedList.size : 0}</BoldText>
              <Text style={styles.infoLabel}>{t('PRAYERS_PARTICIPATED')}</Text>
            </Touchable>
          </View>
        </View>
        <View style={styles.accountSection}>
          <View style={styles.accountRow}>
            <Text style={styles.label}>{t('SIGN:FULL_NAME')}</Text>
            {isEditingFullName ? (
              <TextInput
                onBlur={updateFullName}
                defaultValue={user.fullName}
                value={currentFullName}
                onChangeText={setCurrentFullName}
                style={styles.textInput}
                autoFocus={true}
              />
            ) : (
                <View style={styles.fieldWrapper}>
                  <Text style={styles.textField}>{user.fullName}</Text>
                  <Touchable onPress={() => setIsEditingFullName(true)}>
                    <Ionicons
                      style={{ color: '#7F7F7F' }}
                      name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
                      size={24}
                    />
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
            <Text style={styles.textField}>{user.gender === 'M' ? t('COMMON:GENDER.MALE') : t('COMMON:GENDER.FEMALE')}</Text>
          </View>
        </View>

        <View style={styles.sessionSection}>
          <Touchable>
            <ListItem style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}>{t('CHANGE_PASSWORD')}</Text>
              <Ionicons style={{ marginLeft: 10, color: colors.primary }} name={Platform.OS === 'ios' ? 'ios-lock' : 'md-lock'} size={24} />
            </ListItem>
          </Touchable>
          <Touchable>
            <ListItem onPress={logout} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, textAlign: 'center', textTransform: 'uppercase' }}>{t('LOGOUT')}</Text>
              <Ionicons style={{ marginLeft: 10, color: colors.primary }} name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'} size={24} />
            </ListItem>
          </Touchable>
        </View>

        <View style={{ marginVertical: 15 }}>
          <Touchable>
            <Text style={styles.footerText}>{t('DELETE_ACCOUNT')}</Text>
          </Touchable>
          <Touchable onPress={() => Linking.openURL(`https://wahd.app/privacy`)}>
            <Text style={styles.footerText}>{t('OPTIONS.PRIVACY')}</Text>
          </Touchable>
        </View>
      </ScrollView>
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
  titleStyle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 25
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 25,
    width: '100%',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    marginBottom: 20
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