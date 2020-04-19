import React from 'react';
import { StyleSheet, Platform, View, Image } from 'react-native';
import { Content } from 'native-base';
import { Text, BoldText, RoundButton } from 'components';
import { EMAIL_SENT } from 'assets/images';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function EmailSentScreen({ navigation: { navigate } }) {
  const { t } = useTranslation(['SIGN']);

  return (
    <View behavior="padding" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Content contentContainerStyle={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={EMAIL_SENT} style={styles.image} />
            </View>

            <View style={styles.descriptionSection}>
              <BoldText style={styles.bold}>{t('VERIFY.HEADER')}</BoldText>
              <Text style={styles.text}>{t('VERIFY.DESCRIPTION')}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <View style={{ width: '100%' }}>
                <RoundButton onPress={() => navigate('Login')}>
                  {t('BACK_TO_LOGIN')}
                </RoundButton>
              </View>
            </View>

          </View>
        </View>
      </Content>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    padding: 25,
    width: '100%'
  },
  imageContainer: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 150
  },
  descriptionSection: {
    marginVertical: 25,
  },
  bold: {
    fontSize: 20,
    textAlign: 'center',
    color: '#7C7C7C'
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7C7C7C',
    marginTop: 25
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    width: '100%'
  },
  inputGroup: {
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  input: {
    fontSize: 12,
    justifyContent: 'center',
    marginHorizontal: 10,
    fontFamily: 'Sen',
    lineHeight: 16
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    height: 52
  }
});