import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, AsyncStorage, Platform, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, BoldText, PrayerCard } from 'components';
import { auth, db } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR, NOT_FOUND } from 'assets/images';
import moment from 'moment';

export default function ProfileScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [invitedPrayersList, setInvitedPrayersList] = useState([]);
  const [participatedLength, setParticipatedLength] = useState(0);
  const user = useSelector(state => state.userState);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 25 }}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-more' : 'md-more'} size={24} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      getInvitedNum();
      getParticipatedNum();
    }
  }, [user]);

  async function getInvitedNum() {
    const invitedDoc = await db.collection('prayers')
      .where('inviter', '==', db.doc('users/' + auth.currentUser.uid))
      .get();

    const invitedPrayers = [];
    invitedDoc.forEach(doc => {
      invitedPrayers.push({ ...doc.data(), id: doc.id, inviterID: auth.currentUser.uid });
    });

    invitedPrayers.sort((a, b) => moment(b.timestamp).diff(moment(a.timestamp)));

    setIsLoading(false);
    setInvitedPrayersList(invitedPrayers);
  }

  async function getParticipatedNum() {
    const snap = await db.collection('prayers')
      .where('participants', 'array-contains', db.doc('users/' + auth.currentUser.uid))
      .get();

    setParticipatedLength(snap.size);
  }

  // useEffect(() => {
  //   auth.signOut();
  //   AsyncStorage.removeItem('prayersFilter');
  // }, []);
  return (
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
            <View style={styles.infoItem}>
              <BoldText style={styles.infoNumber}>{invitedPrayersList.length}</BoldText>
              <BoldText style={styles.infoLabel}>prayers invited</BoldText>
            </View>
            <View style={styles.infoItem}>
              <BoldText style={styles.infoNumber}>{participatedLength}</BoldText>
              <BoldText style={styles.infoLabel}>prayers participated</BoldText>
            </View>
          </View>
        </View>
      </View>
      <View style={{ ...styles.prayerListWrapper, height: invitedPrayersList.length ? null : '100%' }}>
        {isLoading
          ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color="#000" size="large" />
            </View>
          ) : (
            <FlatList
              style={{ height: '100%' }}
              data={invitedPrayersList}
              renderItem={({ item }) => <PrayerCard {...item} navigate={navigation.navigate} />}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => (
                <View style={styles.imageContainer}>
                  <Image source={NOT_FOUND} style={styles.image} />
                  <Text style={styles.notFoundText}>No prayer invited so far :(</Text>
                </View>
              )}
            />
          )
        }
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 15
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
    marginBottom: 120
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
  }
})