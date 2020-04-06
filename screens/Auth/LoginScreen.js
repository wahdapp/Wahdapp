import React, { useState } from 'react';
import { StyleSheet, Platform, View, Image, ScrollView } from 'react-native';
import { Form, Input, Toast, InputGroup, Card } from 'native-base';
import { Text, Touchable, BoldText } from 'components';
import AnimatedButton from 'components/AnimatedButton';
import { auth, signInWithFacebook, signInWithGoogle } from 'firebaseDB';
import { BISMILLAH, FACEBOOK, GOOGLE } from 'assets/images';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function LoginScreen({ navigation: { navigate } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['SIGN']);

  async function handleLogin() {
    if (!email || !password) {
      Toast.show({
        text: t('ERROR.0'),
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: "danger"
      });
      return;
    }
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
    }
    catch (e) {
      setLoading(false);
      Toast.show({
        text: e.message,
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: "danger"
      });
    }
  }

  async function handleFacebookPress() {
    await signInWithFacebook();
  }

  async function handleGooglePress() {
    await signInWithGoogle();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 150, width: '100%', resizeMode: 'contain' }}
            source={BISMILLAH}
          />
        </View>
        <View style={{ width: '100%', paddingHorizontal: 25, marginBottom: 25 }}>
          <BoldText style={{ fontSize: 24, color: '#000', textAlign: 'center' }}>Welcome to JamaatApp</BoldText>
        </View>
        <View style={styles.formContainer}>
          <Form>
            <InputGroup floatingLabel rounded style={styles.inputGroup}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
              <Input value={email} onChangeText={setEmail} style={styles.input} />
            </InputGroup>
            <InputGroup floatingLabel rounded style={styles.inputGroup}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-lock' : 'md-lock'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
              <Input value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} />
            </InputGroup>
          </Form>
          <View style={styles.forgotPwdContainer}>
            <Touchable onPress={() => navigate('ForgotPassword')}>
              <Text styles={styles.forgotPwdText}>{t('FORGOT_PWD')}</Text>
            </Touchable>
          </View>
          <View style={styles.loginBtnContainer}>
            <AnimatedButton
              showLoading={loading}
              width={150}
              height={45}
              title={t('LOGIN')}
              titleFontSize={14}
              titleFontFamily="Sen"
              titleColor="rgb(255,255,255)"
              backgroundColor="#68A854"
              borderRadius={25}
              onPress={handleLogin}
            />
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('NOT_HAVE')}</Text>
            <Text style={{ ...styles.signUpLabel, color: colors.secondary }} onPress={() => navigate('Signup')}> {t('SIGNUP_NOW')} </Text>
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('CONNECT')}</Text>
          </View>

          {/* <View style={styles.loginBtnContainer}>
            <Touchable onPress={handleFacebookPress}>
              <View style={styles.facebookButton}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={FACEBOOK} />
                <Text style={{ fontSize: 10, color: '#ffffff' }}>Continue With Facebook</Text>
              </View>
            </Touchable>
          </View> */}

          <View style={styles.loginBtnContainer}>
            <Touchable onPress={handleGooglePress}>
              <View style={styles.googleButton}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={GOOGLE} />
                <Text style={{ fontSize: 10, color: '#7F7F7F' }}>Continue With Google</Text>
              </View>
            </Touchable>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    color: '#68A854',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 25,
    borderRadius: 8,
    shadowOpacity: 0.65,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
  },
  imageContainer: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    width: '100%'
  },
  loginBtnContainer: {
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center'
  },
  loginBtn: { alignItems: 'center', justifyContent: 'center', minWidth: 150, backgroundColor: colors.primary },
  forgotPwdContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  forgotPwdText: {
    fontSize: 12,
    color: '#7C7C7C'
  },
  signUpLabelContainer: {
    marginTop: 25,
  },
  signUpLabel: {
    fontSize: 12,
    color: '#7C7C7C',
    textAlign: 'center'
  },
  hyperlink: {
    fontSize: 14,
    color: 'blue'
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
  facebookButton: {
    height: 52,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#3b5998'
  },
  googleButton: {
    height: 52,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowOpacity: 0.65,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
  }
});