import React, { useState } from 'react';
import { StyleSheet, Platform, View, Image, TextInput } from 'react-native';
import { Toast, Content } from 'native-base';
import { Text, BoldText, Loader, RoundButton } from 'components';
import { auth } from 'firebaseDB';
import { FORGOT, EMAIL_SENT } from 'assets/images';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function ForgotPasswordScreen({ navigation: { navigate } }) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useTranslation(['SIGN', 'COMMON']);

  async function sendResetEmail() {
    try {
      setIsSending(true);

      await auth.sendPasswordResetEmail(email);

      setIsSending(false);
      setIsSent(true);
    }
    catch (e) {
      setIsSending(false);
      Toast.show({
        text: e.message,
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: 'danger',
        duration: 3000
      });
    }
  }

  return (
    <View behavior="padding" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      {isSending && <Loader />}
      <Content contentContainerStyle={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={isSent ? EMAIL_SENT : FORGOT} style={styles.image} />
            </View>

            {isSent ? (
              <>
                <View style={styles.descriptionSection}>
                  <BoldText style={styles.bold}>{t('RESET.HEADER')}</BoldText>
                  <Text style={styles.text}>{t('RESET.DESCRIPTION')}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <View style={{ width: '100%' }}>
                    <RoundButton onPress={sendResetEmail}>
                      {t('BACK_TO_LOGIN')}
                    </RoundButton>
                  </View>
                </View>
              </>
            ) : (
                <>
                  <View style={styles.descriptionSection}>
                    <BoldText style={styles.bold}>{t('FORGOT.HEADER')}</BoldText>
                    <Text style={styles.text}>{t('FORGOT.DESCRIPTION')}</Text>
                  </View>

                  <View style={styles.formContainer}>
                    <BoldText style={styles.inputLabel}>{t('EMAIL')}</BoldText>
                    <TextInput value={email} onChangeText={setEmail} style={styles.textInput} placeholder="ahmad@email.com" placeholderTextColor="#dedede" />
                  </View>

                  <View style={styles.buttonContainer}>
                    <View style={{ width: '100%' }}>
                      <RoundButton onPress={sendResetEmail}>
                        {t('SUBMIT')}
                      </RoundButton>
                    </View>
                  </View>
                </>
              )}
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
    width: '100%',
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C'
  },
  textInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 1.8,
    fontSize: 16,
    paddingLeft: -10
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