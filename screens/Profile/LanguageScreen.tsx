import React from 'react';
import { View } from 'react-native';
import { Text, Touchable } from '@/components';
import i18n from 'i18next';
import { ListItem, Radio, Right, Left } from 'native-base';
import { languages } from '@/constants/languages';
import { formatLanguage } from '@/helpers/dateFormat';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/id';
import 'dayjs/locale/fr';
import { updateLocale } from '@/services/user';
import useLogScreenView from '@/hooks/useLogScreenView';

type LanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Language'>;

type Props = {
  navigation: LanguageScreenNavigationProp;
};

function LanguageScreen({ navigation }: Props) {
  useLogScreenView('language');
  async function handleSelectLanguage(lng) {
    navigation.goBack();
    i18n.changeLanguage(lng);
    formatLanguage(lng);

    await updateLocale(lng);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {languages.map((language, i) => (
        <Touchable onPress={() => handleSelectLanguage(language.code)} key={i}>
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
  );
}

export default LanguageScreen;
