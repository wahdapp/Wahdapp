import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import { useSnackbar } from '@/contexts/snackbar';
import { BoldText, Loader, RoundButton, GenderBox } from '@/components';
import { auth } from '@/firebase';
import * as Animatable from 'react-native-animatable';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import colors from '@/constants/colors';
import { createUser } from '@/services/user';
import { convertLanguageCode } from '@/helpers/languageCode';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/types';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

type Props = {
  navigation: SignupScreenNavigationProp;
};

export default function SignupScreen({ navigation: { navigate } }: Props) {
  const { t } = useTranslation(['SIGN', 'COMMON']);
  const [, setErrorMessage] = useSnackbar();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage(t('ERROR.1'));
      return;
    }

    try {
      setLoading(true);
      await auth.createUserWithEmailAndPassword(email.trim(), password);
      await createUser({
        uid: auth.currentUser.uid,
        full_name: fullName.trim(),
        email: email.trim(),
        gender,
      });

      auth.languageCode = convertLanguageCode(i18n.language);
      await auth.currentUser.sendEmailVerification();
      await auth.signOut();
      setLoading(false);
      navigate('EmailSent');
    } catch (e) {
      setLoading(false);
      if (e.message) {
        setErrorMessage(e.message);
      } else if (typeof e === 'string') {
        setErrorMessage(e);
      }
    }
  }

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%', height: '100%' }}>
        <Animatable.View animation="fadeInUp" style={styles.titleContainer}>
          <BoldText style={styles.title}>{t('CREATE_ACCOUNT')}</BoldText>
        </Animatable.View>
        <View style={styles.formContainer}>
          <Animatable.View animation="fadeInUp" delay={250}>
            <BoldText style={styles.inputLabel}>{t('FULL_NAME')}</BoldText>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.textInput}
              placeholder="Ahmad Ali"
              placeholderTextColor="#dedede"
              maxLength={30}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={500}>
            <BoldText style={styles.inputLabel}>{t('EMAIL')}</BoldText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              placeholder="ahmad@email.com"
              placeholderTextColor="#dedede"
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={750}>
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

          <Animatable.View animation="fadeInUp" delay={1000}>
            <BoldText style={styles.inputLabel}>{t('COMMON:GENDER.LABEL')}</BoldText>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <GenderBox
                label={t('COMMON:GENDER.MALE')}
                gender="M"
                onPress={() => setGender('M')}
                isSelected={gender === 'M'}
              />
              <GenderBox
                label={t('COMMON:GENDER.FEMALE')}
                gender="F"
                onPress={() => setGender('F')}
                isSelected={gender === 'F'}
              />
            </View>
          </Animatable.View>

          <Animatable.View animation="bounceIn" delay={1800} style={styles.signupBtnContainer}>
            <RoundButton onPress={handleSignup}>{t('SIGNUP')}</RoundButton>
          </Animatable.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  signupContainer: {
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
  titleContainer: {
    width: '100%',
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    letterSpacing: 0.9,
    color: colors.primary,
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 25,
    width: '100%',
  },
  signupBtnContainer: {
    marginTop: 45,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 40,
  },
  signupBtn: {
    height: 52,
    width: '100%',
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  inputLabel: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C',
  },
  inputGroup: {
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
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
});
