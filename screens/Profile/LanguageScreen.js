import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Text } from 'components';
import i18n from 'i18next';
import { ListItem, Radio, Right, Left } from 'native-base';
import { languages } from 'constants/languages';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

function LanguageScreen({ navigation }) {
  async function handleSelectLanguage(lng) {
    i18n.changeLanguage(lng);
    await AsyncStorage.setItem('lang', lng);
    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {languages.map((language, i) => (
        <TouchableNativeFeedback onPress={() => handleSelectLanguage(language.code)}>
          <ListItem key={i}>
            <Left>
              <Text>{language.label}</Text>
            </Left>
            <Right>
              <Radio selected={i18n.language === language.code} />
            </Right>
          </ListItem>
        </TouchableNativeFeedback>
      ))}
    </View>
  )
}

export default LanguageScreen;