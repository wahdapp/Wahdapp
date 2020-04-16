import React, { useState } from 'react';
import { StyleSheet, View, Picker, ScrollView, Dimensions, TextInput } from 'react-native';
import { Form, Toast } from 'native-base';
import { BoldText, Touchable, Text, Loader } from 'components';
import { auth, createAccount } from 'firebaseDB';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function SignupScreen({ navigation: { navigate } }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [gender, setGender] = useState('M');

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['SIGN', 'COMMON']);

  async function handleSignup() {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      Toast.show({
        text: t('ERROR.1'),
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: 'danger',
        duration: 3000
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        text: t('ERROR.2'),
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: 'danger',
        duration: 3000
      });
      return;
    }

    try {
      setLoading(true);
      await auth.createUserWithEmailAndPassword(email.trim(), password);
      await createAccount(fullName.trim(), email.trim(), gender);
      await auth.currentUser.sendEmailVerification();
      await auth.signOut();
      navigate('EmailSent');
    }
    catch (e) {
      setLoading(false);
      Toast.show({
        text: e.message,
        textStyle: { fontSize: 12 },
        buttonText: t('ERROR.3'),
        type: 'danger',
        duration: 3000
      });
    }
  }

  if (loading) return <Loader />

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%', height: '100%' }}>
        <View style={styles.titleContainer}>
          <BoldText style={styles.title}>{t('CREATE_ACCOUNT')}</BoldText>
        </View>
        <View style={styles.formContainer}>
          <Form>
            <BoldText style={styles.inputLabel}>{t('FULL_NAME')}</BoldText>
            <TextInput value={fullName} onChangeText={setFullName} style={styles.textInput} placeholder="Ahmad Ali" placeholderTextColor="#dedede" />

            <BoldText style={styles.inputLabel}>{t('EMAIL')}</BoldText>
            <TextInput value={email} onChangeText={setEmail} style={styles.textInput} placeholder="ahmad@email.com" placeholderTextColor="#dedede" />

            <BoldText style={styles.inputLabel}>{t('PASSWORD')}</BoldText>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.textInput} placeholder="********" placeholderTextColor="#dedede" />

            <BoldText style={styles.inputLabel}>{t('CONFIRM')}</BoldText>
            <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry={true} style={styles.textInput} placeholder="********" placeholderTextColor="#dedede" />

            <View style={{ marginTop: 25 }}>
              <BoldText style={styles.inputLabel}>{t('COMMON:GENDER.LABEL')}</BoldText>
              <Picker style={{ width: '100%', paddingHorizontal: 10 }} itemStyle={{ height: 100 }} selectedValue={gender} onValueChange={item => setGender(item)}>
                <Picker.Item label={t('COMMON:GENDER.MALE')} value="M" />
                <Picker.Item label={t('COMMON:GENDER.FEMALE')} value="F" />
              </Picker>
            </View>

            <View style={styles.signupBtnContainer}>
              <Touchable
                style={styles.signupBtn}
                onPress={handleSignup}
              >
                <Text style={{ fontSize: 14, letterSpacing: 1.8, color: '#ffffff' }}>{t('SIGNUP')}</Text>
              </Touchable>
            </View>
          </Form>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 40
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
    paddingHorizontal: 35
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 0.9,
    color: colors.primary
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 25,
    width: '100%'
  },
  signupBtnContainer: {
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    width: '100%'
  },
  signupBtn: {
    height: 52,
    width: '100%',
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  inputLabel: {
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 10,
    color: '#7C7C7C'
  },
  inputGroup: {
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  textInput: {
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'Sen',
    borderWidth: 0,
    letterSpacing: 1.8,
    fontSize: 16,
    paddingLeft: -10
  }
});