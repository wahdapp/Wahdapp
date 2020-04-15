import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, AsyncStorage, Platform, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, BoldText, Touchable } from 'components';
import { auth, db } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';
import { setFullName } from 'actions';
import BottomSheet from 'reanimated-bottom-sheet';
import { ListItem, Body, Left } from 'native-base';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation(['PROFILE', 'SIGN', 'COMMON']);
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [invitedPrayersList, setInvitedPrayersList] = useState([]);
  const [participatedList, setParticipatedList] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userState);
  const [currentFullName, setCurrentFullName] = useState(user.fullName);
  const bottomSheetRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 25, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }} onPress={() => bottomSheetRef.current.snapTo(0)}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, bottomSheetRef]);

  useEffect(() => {
    if (user) {
      getPastInfo();
    }
  }, [user]);

  async function getPastInfo() {
    const invitedDoc = await db.collection('prayers')
      .where('inviter', '==', db.doc('users/' + auth.currentUser.uid))
      .get();

    const participatedDoc = await db.collection('prayers')
      .where('participants', 'array-contains', db.doc('users/' + auth.currentUser.uid))
      .get();

    // const invitedPrayers = [];
    // invitedDoc.forEach(doc => {
    //   invitedPrayers.push({ ...doc.data(), id: doc.id, inviterID: auth.currentUser.uid, inviter: user });
    // });

    // invitedPrayers.sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)));

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

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
    )
  }

  function renderContent() {
    return (
      <View style={styles.panel}>
        <Touchable onPress={() => navigation.navigate('About')}>
          <ListItem icon onPress={() => navigation.navigate('About')}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-information-circle' : 'md-information-circle'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.ABOUT')}</Text></Body>
          </ListItem>
        </Touchable>
        <Touchable onPress={() => navigation.navigate('Contact')}>
          <ListItem icon onPress={() => navigation.navigate('Contact')}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.CONTACT')}</Text></Body>
          </ListItem>
        </Touchable>
        <Touchable onPress={() => navigation.navigate('Donate')}>
          <ListItem icon onPress={() => navigation.navigate('Donate')}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-cash' : 'md-cash'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.DONATE')}</Text></Body>
          </ListItem>
        </Touchable>
        <Touchable onPress={() => navigation.navigate('FAQ')}>
          <ListItem icon onPress={() => navigation.navigate('FAQ')}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-help-circle' : 'md-help-circle'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.FAQ')}</Text></Body>
          </ListItem>
        </Touchable>
        <Touchable onPress={() => navigation.navigate('Language')}>
          <ListItem icon onPress={() => navigation.navigate('Language')}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-planet' : 'md-planet'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.LANGUAGE')}</Text></Body>
          </ListItem>
        </Touchable>
        <Touchable onPress={logout}>
          <ListItem icon onPress={logout}>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.LOGOUT')}</Text></Body>
          </ListItem>
        </Touchable>
      </View>
    )
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
        <View style={styles.profileHeader}>
          <View style={styles.profilePicContainer}>
            <Image source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 75, height: 75 }} />
          </View>

          <View style={styles.nameContainer}>
            <BoldText style={styles.nameText}>{user.fullName}</BoldText>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
              <Touchable style={styles.infoItem} onPress={handleInvitedPress}>
                <BoldText style={styles.infoNumber}>{invitedPrayersList.size ? invitedPrayersList.size : 0}</BoldText>
                <BoldText style={styles.infoLabel}>{t('PRAYERS_INVITED')}</BoldText>
              </Touchable>
              <Touchable style={styles.infoItem} onPress={handleParticipatedPress}>
                <BoldText style={styles.infoNumber}>{participatedList.size ? participatedList.size : 0}</BoldText>
                <BoldText style={styles.infoLabel}>{t('PRAYERS_PARTICIPATED')}</BoldText>
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
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[300, 0]}
        renderHeader={renderHeader}
        renderContent={renderContent}
        initialSnap={1}
      />
    </>
  )
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingTop: 15
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
    color: colors.primary
  },
  infoSection: {
    marginTop: 25,
    width: '100%'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15
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
    color: '#7C7C7C',
    fontSize: 10,
    textAlign: 'center'
  },
  prayerListWrapper: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 250
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 250
  },
  notFoundText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 18,
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
  },
  label: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C',
    color: colors.primary,
    textTransform: 'uppercase'
  },
  textField: {
    marginLeft: 10,
    letterSpacing: 0.9,
    fontSize: 14,
    color: '#7F7F7F'
  },
  textInput: {
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 0.9,
    fontSize: 14,
    paddingLeft: -10
  }
})