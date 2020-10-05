import React from 'react';
import { StyleSheet, Platform, View, Image, ScrollView } from 'react-native';
import { Text, BoldText, RoundButton } from '@/components';
import { EMAIL_SENT } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/types';

type EmailSentScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailSent'>;

type Props = {
  navigation: EmailSentScreenNavigationProp;
};

export default function EmailSentScreen({ navigation: { navigate } }: Props) {
  const { t } = useTranslation(['SIGN']);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
    >
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.container}>
          <View>
            <View style={styles.imageContainer}>
              <Image source={EMAIL_SENT} style={styles.image} />
            </View>

            <View style={styles.descriptionSection}>
              <BoldText style={styles.bold}>{t('VERIFY.HEADER')}</BoldText>
              <Text style={styles.text}>{t('VERIFY.DESCRIPTION')}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <View style={{ width: '100%' }}>
                <RoundButton onPress={() => navigate('Login')}>{t('BACK_TO_LOGIN')}</RoundButton>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    padding: 25,
    width: '100%',
  },
  imageContainer: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 150,
  },
  descriptionSection: {
    marginVertical: 25,
  },
  bold: {
    fontSize: 20,
    textAlign: 'center',
    color: '#7C7C7C',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7C7C7C',
    marginTop: 25,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    height: 52,
  },
});
