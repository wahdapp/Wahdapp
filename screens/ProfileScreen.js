import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { View, AsyncStorage, Platform, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, BoldText, PrayerCard } from 'components';
import { auth, db } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR, NOT_FOUND } from 'assets/images';
import moment from 'moment';
import BottomSheet from 'reanimated-bottom-sheet';
import { ListItem, Body, Left } from 'native-base';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation(['PROFILE']);
  const [isLoading, setIsLoading] = useState(true);
  const [invitedPrayersList, setInvitedPrayersList] = useState([]);
  const [participatedLength, setParticipatedLength] = useState(0);
  const user = useSelector(state => state.userState);
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

    const snap = await db.collection('prayers')
      .where('participants', 'array-contains', db.doc('users/' + auth.currentUser.uid))
      .get();

    const invitedPrayers = [];
    invitedDoc.forEach(doc => {
      invitedPrayers.push({ ...doc.data(), id: doc.id, inviterID: auth.currentUser.uid, inviter: user });
    });

    invitedPrayers.sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)));

    setIsLoading(false);
    setInvitedPrayersList(invitedPrayers);
    setParticipatedLength(snap.size);
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
        <TouchableNativeFeedback onPress={() => navigation.navigate('Language')}>
          <ListItem icon>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-planet' : 'md-planet'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.LANGUAGE')}</Text></Body>
          </ListItem>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={logout}>
          <ListItem icon>
            <Left>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-log-out' : 'md-log-out'} size={24} />
            </Left>
            <Body><Text>{t('OPTIONS.LOGOUT')}</Text></Body>
          </ListItem>
        </TouchableNativeFeedback>
      </View>
    )
  }

  function logout() {
    auth.signOut();
    AsyncStorage.removeItem('prayersFilter');
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.profileHeader}>
          <View style={styles.profilePicContainer}>
            <Image source={user.gender === 'M' ? MAN_AVATAR : WOMAN_AVATAR} style={{ width: 75, height: 75 }} />
          </View>

          <View style={styles.nameContainer}>
            <BoldText style={styles.nameText}>{user.fullName}</BoldText>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <BoldText style={styles.infoNumber}>{invitedPrayersList.length}</BoldText>
                <BoldText style={styles.infoLabel}>{t('PRAYERS_INVITED')}</BoldText>
              </View>
              <View style={styles.infoItem}>
                <BoldText style={styles.infoNumber}>{participatedLength}</BoldText>
                <BoldText style={styles.infoLabel}>{t('PRAYERS_PARTICIPATED')}</BoldText>
              </View>
            </View>
          </View>
        </View>
        <View style={{ ...styles.prayerListWrapper, height: invitedPrayersList.length ? null : '100%' }}>
          {isLoading
            ? (
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                <ActivityIndicator color="#000" size="large" />
              </View>
            ) : (
              <FlatList
                style={{ height: '100%', paddingTop: 15 }}
                data={invitedPrayersList}
                renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View style={styles.imageContainer}>
                    <Image source={NOT_FOUND} style={styles.image} />
                    <Text style={styles.notFoundText}>{t('EMPTY')}</Text>
                  </View>
                )}
              />
            )
          }
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[250, 0]}
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
    color: '#68A854'
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
    color: '#68A854',
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
})