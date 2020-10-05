import React, { useState, useContext } from 'react';
import { StyleSheet, Platform, View, Image, TextInput, ScrollView } from 'react-native';
import { SnackbarContext } from 'contexts/snackbar';
import { Text, BoldText, Loader, RoundButton } from 'components';
import { auth } from 'firebaseDB';
import { FORGOT, EMAIL_SENT } from 'assets/images';
import { useTranslation } from 'react-i18next';
import colors from '@/constants/colors';

export default function ForgotPasswordScreen({ navigation: { navigate } }) {
  const { t } = useTranslation(['SIGN', 'COMMON']);
  const { setErrorMessage } = useContext(SnackbarContext);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  async function sendResetEmail() {
    try {
      setIsSending(true);

      await auth.sendPasswordResetEmail(email);

      setIsSending(false);
      setIsSent(true);
    }
    catch (e) {
      setIsSending(false);
      setErrorMessage(e.message);
    }
  }

  return (
    <View behavior="padding" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      {isSending && <Loader />}
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View>
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
      </ScrollView>
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