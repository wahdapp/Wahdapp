import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, TextInput, Linking } from 'react-native';
import { useSnackbar } from '@/contexts/snackbar';
import { Text, Touchable, BoldText, Loader, RoundButton } from '@/components';
import { auth, signInWithFacebook, signInWithGoogle } from '@/firebase';
import { FACEBOOK, GOOGLE, LOGO_WHITE } from '@/assets/images';
import { useTranslation } from 'react-i18next';
import * as Animatable from 'react-native-animatable';
import colors from '@/constants/colors';
import { Notifications } from 'expo';
import { registerToken } from '@/services/device-token';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/types';
import { useDispatch } from 'react-redux';
import { setDeviceToken } from '@/actions';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation: { navigate } }: Props) {
  const { t } = useTranslation(['SIGN', 'PROFILE']);
  const dispatch = useDispatch();
  const [, setErrorMessage] = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function displayError(message) {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  async function registerPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      await registerToken(token);

      dispatch(setDeviceToken(token));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      displayError(t('ERROR.0'));
      return;
    }
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);

      registerPushToken();
    } catch (e) {
      setLoading(false);
      displayError(e.message);
    }
  }

  async function handleFacebookPress() {
    await signInWithFacebook();
    await registerPushToken();
  }

  async function handleGooglePress() {
    await signInWithGoogle();
    await registerPushToken();
  }

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.container}>
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Image style={{ width: 100, height: 100, resizeMode: 'cover' }} source={LOGO_WHITE} />
        </View>

        <Animatable.View
          animation="fadeInUp"
          style={{ width: '100%', paddingHorizontal: 35, marginTop: 30, marginBottom: 60 }}
        >
          <BoldText style={styles.headerText}>{t('WELCOME')}</BoldText>
          <Text style={styles.subheaderText}>{t('PROCEED')}</Text>
        </Animatable.View>
        <View style={styles.formContainer}>
          <Animatable.View animation="fadeInUp" delay={300}>
            <BoldText style={styles.inputLabel}>{t('EMAIL')}</BoldText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              placeholder="ahmad@email.com"
              placeholderTextColor="#dedede"
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={600}>
            <BoldText style={styles.inputLabel}>{t('PASSWORD')}</BoldText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.textInput}
              placeholder="********"
              placeholderTextColor="#dedede"
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={900} style={styles.forgotPwdContainer}>
            <Touchable onPress={() => navigate('ForgotPassword')}>
              <Text style={{ fontSize: 10, color: '#7F7F7F' }}>{t('FORGOT_PWD')}</Text>
            </Touchable>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            delay={1200}
            style={{ ...styles.loginBtnContainer, width: '100%' }}
          >
            <RoundButton onPress={handleLogin}>{t('LOGIN')}</RoundButton>
          </Animatable.View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('NOT_HAVE')}</Text>
            <Text
              style={{ ...styles.signUpLabel, color: colors.primary }}
              onPress={() => navigate('Signup')}
            >
              {' '}
              {t('SIGNUP_NOW')}{' '}
            </Text>
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('CONNECT')}</Text>
          </View>

          <Animatable.View
            animation="bounceIn"
            delay={2000}
            style={{ ...styles.loginBtnContainer, width: '100%', marginTop: 15 }}
          >
            <Touchable onPress={handleFacebookPress}>
              <View style={styles.facebookButton}>
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }}
                  source={FACEBOOK}
                />
                <Text style={{ fontSize: 10, color: '#ffffff' }}>{t('FACEBOOK_LOGIN')}</Text>
              </View>
            </Touchable>
          </Animatable.View>

          <Animatable.View
            animation="bounceIn"
            delay={2300}
            style={{ ...styles.loginBtnContainer, width: '100%', marginTop: 15 }}
          >
            <Touchable onPress={handleGooglePress}>
              <View style={styles.googleButton}>
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }}
                  source={GOOGLE}
                />
                <Text style={{ fontSize: 10, color: '#7F7F7F' }}>{t('GOOGLE_LOGIN')}</Text>
              </View>
            </Touchable>
          </Animatable.View>

          <View style={{ ...styles.loginBtnContainer, marginVertical: 15 }}>
            <View>
              <Touchable onPress={() => Linking.openURL(`https://wahd.app/privacy`)}>
                <Text style={{ fontSize: 8, color: '#7F7F7F' }}>
                  {t('PROFILE:OPTIONS.PRIVACY')}
                </Text>
              </Touchable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 26,
    textAlign: 'center',
    color: colors.primary,
    letterSpacing: 0.9,
  },
  subheaderText: {
    color: '#7C7C7C',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
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
    paddingRight: 25,
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    width: '100%',
  },
  loginBtnContainer: {
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
  },
  loginBtn: {
    height: 52,
    width: '100%',
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  forgotPwdContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  signUpLabelContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpLabel: {
    fontSize: 12,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 30,
  },
  hyperlink: {
    fontSize: 14,
    color: 'blue',
  },
  textInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 1.8,
    fontSize: 16,
    paddingLeft: -10,
  },
  inputLabel: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C',
  },
  facebookButton: {
    height: 52,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#3b5998',
    borderWidth: 0.3,
    shadowOpacity: 0.45,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
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
    borderColor: '#7F7F7F',
    borderWidth: 0.3,
    shadowOpacity: 0.45,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
  },
});
