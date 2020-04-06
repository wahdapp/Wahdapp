import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, AsyncStorage, StyleSheet } from 'react-native';
import { Text, Touchable } from 'components';
import i18n from 'i18next';
import { ListItem, Radio, Right, Left } from 'native-base';
import { auth, db } from 'firebaseDB';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUser, initializeFilter } from 'actions';

function SelectGenderScreen({ setIsFirstOAuth, setUserDataFetched }) {
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();

  async function chooseGender(gender) {
    setIsCreating(true);

    const user = {
      fullName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      gender,
    }

    await db.collection('users').doc(auth.currentUser.uid).set(user);

    dispatch(setUser(user));
    dispatch(initializeFilter(gender));
    setIsCreating(false);

    setIsFirstOAuth(false);
    setUserDataFetched(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Spinner
        visible={isCreating}
        textContent={'Loading...'}
        textStyle={{ color: '#fff' }}
      />
      <Text style={styles.header}>Please choose your gender</Text>
      <Touchable onPress={() => chooseGender('M')}>
        <ListItem onPress={() => chooseGender('M')}>
          <Left>
            <Text>Male</Text>
          </Left>
          <Right>
            <Radio />
          </Right>
        </ListItem>
      </Touchable>
      <Touchable onPress={() => chooseGender('F')}>
        <ListItem onPress={() => chooseGender('F')}>
          <Left>
            <Text>Female</Text>
          </Left>
          <Right>
            <Radio />
          </Right>
        </ListItem>
      </Touchable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginVertical: 25,
    letterSpacing: 1.8,
    padding: 25,
  }
})

export default SelectGenderScreen;