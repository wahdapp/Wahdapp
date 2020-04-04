import React, { useState } from 'react';
import { StyleSheet, Platform, View, Image, ScrollView } from 'react-native';
import { Form, Input, Toast, InputGroup, Card } from 'native-base';
import { Text } from 'components';
import AnimatedButton from 'components/AnimatedButton';
import { auth } from 'firebaseDB';
import { BISMILLAH } from 'assets/images';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation: { navigate } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Toast.show({
        text: "Email or password is missing",
        textStyle: { fontSize: 12 },
        buttonText: "OK",
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
        buttonText: "OK",
        type: "danger"
      });
    }
  }

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 24 }}>
      <View style={styles.topHeader}>
        <Text style={styles.headerText}>JamaatApp</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={styles.loginContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={{ height: 150, width: '100%', resizeMode: 'contain' }}
              source={BISMILLAH}
            />
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
              <Text styles={styles.forgotPwdText} onPress={() => navigate('ForgotPassword')}>Forgot password</Text>
            </View>
            <View style={styles.loginBtnContainer}>
              <AnimatedButton
                showLoading={loading}
                width={150}
                height={45}
                title="Login"
                titleFontSize={14}
                titleFontFamily="Sen"
                titleColor="rgb(255,255,255)"
                backgroundColor="#68A854"
                borderRadius={25}
                onPress={handleLogin}
              />
            </View>

            <View style={styles.signUpLabelContainer}>
              <Text style={styles.signUpLabel}>Already have an account? </Text>
              <Text style={{ ...styles.signUpLabel, color: '#68A854' }} onPress={() => navigate('Signup')}> Sign Up </Text>
            </View>

            <View style={styles.signUpLabelContainer}>
              <Text style={styles.signUpLabel}>Or connect with</Text>
            </View>

            {/* <View style={styles.loginBtnContainer} s>
              <Button rounded style={styles.loginBtn} onPress={() => navigate('Signup')}>
                <Text style={{ color: '#fff' }}>SIGN UP</Text>
              </Button>
            </View> */}
          </View>
        </Card>
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
    flex: 1,
    backgroundColor: '#68A854',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    height: '100%',
    width: '100%',
    padding: 25,
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
  loginBtn: { alignItems: 'center', justifyContent: 'center', minWidth: 150, backgroundColor: '#12967A' },
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
  }
});