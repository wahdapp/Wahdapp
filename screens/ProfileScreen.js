import React, { useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, AsyncStorage, Platform, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, BoldText } from 'components';
import { auth } from 'firebaseDB';
import { MAN_AVATAR, WOMAN_AVATAR } from 'assets/images';

export default function ProfileScreen({ navigation }) {
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

  // useEffect(() => {
  //   auth.signOut();
  //   AsyncStorage.removeItem('prayersFilter');
  // }, []);
  return (
    <ScrollView style={{ flex: 1 }}>
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
              <BoldText style={styles.infoNumber}>3</BoldText>
              <BoldText style={styles.infoLabel}>prayers invited</BoldText>
            </View>
            <View style={styles.infoItem}>
              <BoldText style={styles.infoNumber}>7</BoldText>
              <BoldText style={styles.infoLabel}>prayers participated</BoldText>
            </View>
          </View>
        </View>
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
  }
})