import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Text, Touchable } from '@/components';
import i18n from 'i18next';
import { ListItem, Radio, Right, Left } from 'native-base';
import { languages } from '@/constants/languages';
import { formatLanguage } from '@/helpers/dateFormat';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';

function LanguageScreen({ navigation }) {
  async function handleSelectLanguage(lng) {
    await AsyncStorage.setItem('lang', lng);
    navigation.goBack();
    i18n.changeLanguage(lng);

    formatLanguage(lng);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {languages.map((language, i) => (
        <Touchable onPress={() => handleSelectLanguage(language.code)}>
          <ListItem key={i} onPress={() => handleSelectLanguage(language.code)}>
            <Left>
              <Text>{language.label}</Text>
            </Left>
            <Right>
              <Radio selected={i18n.language === language.code} />
            </Right>
          </ListItem>
        </Touchable>
      ))}
    </View>
  )
}

export default LanguageScreen;