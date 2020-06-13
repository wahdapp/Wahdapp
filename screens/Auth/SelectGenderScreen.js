import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Text, Touchable, Loader } from 'components';
import { ListItem, Radio, Right, Left } from 'native-base';
import { auth } from 'firebaseDB';
import { setUser, initializeFilter } from 'actions';
import { useTranslation } from 'react-i18next';

function SelectGenderScreen({ setIsFirstOAuth, setUserDataFetched }) {
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation(['SIGN', 'COMMON']);

  async function chooseGender(gender) {
    setIsCreating(true);

    const user = {
      fullName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      gender,
    }

    await createUser({
      uid: auth.currentUser.uid,
      full_name: fullName.trim(),
      email: email.trim(),
      gender
    });

    dispatch(setUser(user));
    dispatch(initializeFilter(gender));
    setIsCreating(false);

    setIsFirstOAuth(false);
    setUserDataFetched(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {isCreating && <Loader />}
      <Text style={styles.header}>{t('CHOOSE_GENDER')}</Text>
      <Touchable onPress={() => chooseGender('M')}>
        <ListItem onPress={() => chooseGender('M')}>
          <Left>
            <Text>{t('COMMON:GENDER.MALE')}</Text>
          </Left>
          <Right>
            <Radio />
          </Right>
        </ListItem>
      </Touchable>
      <Touchable onPress={() => chooseGender('F')}>
        <ListItem onPress={() => chooseGender('F')}>
          <Left>
            <Text>{t('COMMON:GENDER.FEMALE')}</Text>
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