import React, { useState } from 'react';
import { StyleSheet, Platform, View, Picker, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { Form, Input, Toast, InputGroup, Content, Button } from 'native-base';
import { Text, BoldText } from 'components';
import { auth } from 'firebaseDB';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
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
        type: 'danger'
      });
    }
  }

  return (
    <View behavior="padding" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Spinner
        visible={isSending}
        textContent={t('COMMON:LOADING')}
        textStyle={{ color: '#fff' }}
      />
      <Content contentContainerStyle={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={isSent ? EMAIL_SENT : FORGOT} style={styles.image} />
            </View>

            {isSent ? (
              <>
                <View style={styles.descriptionSection}>
                  <BoldText style={styles.bold}>Reset Your Password</BoldText>
                  <Text style={styles.text}>An email has been sent to your inbox. Follow the necessary steps to reset your password for your account.</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <Button rounded block style={styles.button} onPress={() => navigate('Login')}>
                    <Text style={{ color: '#fff' }}>BACK TO LOGIN</Text>
                  </Button>
                </View>
              </>
            ) : (
                <>
                  <View style={styles.descriptionSection}>
                    <BoldText style={styles.bold}>{t('FORGOT_QUESTION')}</BoldText>
                    <Text style={styles.text}>{t('FORGOT_DESC')}</Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Form>
                      <InputGroup floatingLabel rounded style={styles.inputGroup}>
                        <Ionicons name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
                        <Input style={styles.input} value={email} onChangeText={setEmail} />
                      </InputGroup>
                    </Form>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button rounded block style={styles.button} onPress={sendResetEmail}>
                      <Text style={{ color: '#fff' }}>{t('SUBMIT')}</Text>
                    </Button>
                  </View>
                </>
              )}
          </View>
        </View>
      </Content>
    </View >
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
    width: '100%',
    paddingHorizontal: 25
  },
  button: {
    width: '100%',
    backgroundColor: colors.secondary,
    height: 52
  }
});