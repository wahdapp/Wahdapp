import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions, Animated, TextInput, Linking } from 'react-native';
import { Form, Toast } from 'native-base';
import { Text, Touchable, BoldText, AnimatedBoldText } from 'components';
import AnimatedButton from 'components/AnimatedButton';
import { auth, signInWithFacebook, signInWithGoogle } from 'firebaseDB';
import { FACEBOOK, GOOGLE, QURAN } from 'assets/images';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function LoginScreen({ navigation: { navigate } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [springValue, setSpringValue] = useState(new Animated.Value(0.3));
  const { t } = useTranslation(['SIGN', 'PROFILE']);

  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    animate();
  }, []);

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

  function animate() {

    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 20 }}>
      <ScrollView style={styles.container}>
      <Image style={{ width: '100%', height: 200, resizeMode: 'cover' }} source={QURAN} />
        <View style={{ width: '100%', paddingHorizontal: 35, marginTop: 30, marginBottom: 25 }}>
          <AnimatedBoldText style={{
            ...styles.headerText,
            opacity: opacity,
            transform: [{
              scale: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.50, 1],
              })
            }]
          }}>Welcome on Wahdapp</AnimatedBoldText>
        </View>
        <View style={styles.formContainer}>
          <Form>
            <BoldText style={styles.inputLabel}>{t('EMAIL')}</BoldText>
            <TextInput value={email} onChangeText={setEmail} style={styles.textInput} placeholder="ahmad@email.com" placeholderTextColor="#dedede" />

            <BoldText style={styles.inputLabel}>{t('PASSWORD')}</BoldText>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.textInput} placeholder="********" placeholderTextColor="#dedede" />
          </Form>
          <View style={styles.forgotPwdContainer}>
            <Touchable onPress={() => navigate('ForgotPassword')}>
              <Text style={{ fontSize: 10, color: '#7F7F7F' }}>{t('FORGOT_PWD')}</Text>
            </Touchable>
          </View>
          <View style={styles.loginBtnContainer}>
            <AnimatedButton
              showLoading={loading}
              width={Dimensions.get('window').width - 45}
              height={50}
              title={t('LOGIN')}
              titleFontSize={14}
              titleFontFamily="Sen"
              titleColor="rgb(255,255,255)"
              backgroundColor={colors.primary}
              borderRadius={25}
              onPress={handleLogin}
            />
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('NOT_HAVE')}</Text>
            <Text style={{ ...styles.signUpLabel, color: colors.primary }} onPress={() => navigate('Signup')}> {t('SIGNUP_NOW')} </Text>
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>{t('CONNECT')}</Text>
          </View>

          {/* <View style={styles.loginBtnContainer}>
            <Touchable onPress={handleFacebookPress}>
              <View style={styles.facebookButton}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={FACEBOOK} />
                <Text style={{ fontSize: 10, color: '#ffffff' }}>{t('FACEBOOK_LOGIN')}</Text>
              </View>
            </Touchable>
          </View> */}

          <View style={{ ...styles.loginBtnContainer, marginTop: 15 }}>
            <Touchable onPress={handleGooglePress}>
              <View style={styles.googleButton}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 15 }} source={GOOGLE} />
                <Text style={{ fontSize: 10, color: '#7F7F7F' }}>{t('GOOGLE_LOGIN')}</Text>
              </View>
            </Touchable>
          </View>

          <View style={{ ...styles.loginBtnContainer, marginVertical: 15 }}>
            <View style={{ textAlign: 'center' }}>
              <Touchable onPress={() => Linking.openURL(`https://wahd.app${subpath}/privacy`)}>
                <Text style={{ fontSize: 8, color: '#7F7F7F' }}>{t('PROFILE:OPTIONS.PRIVACY')}</Text>
              </Touchable>
            </View>
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
    fontSize: 20,
    textAlign: 'left',
    color: colors.primary,
    letterSpacing: 0.9
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
  signUpLabelContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  signUpLabel: {
    fontSize: 12,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 30
  },
  hyperlink: {
    fontSize: 14,
    color: 'blue'
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
  inputLabel: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C'
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
    borderColor: '#7F7F7F',
    borderWidth: 0.7,
    shadowOpacity: 0.65,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
  }
});