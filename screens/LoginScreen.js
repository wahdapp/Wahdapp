import React, { useState } from 'react';
import { StyleSheet, Platform, View, Image, Dimensions } from 'react-native';
import { Form, Item, Input, Label, Button, Text, Toast } from 'native-base';
import AnimatedButton from '../components/AnimatedButton';
import { auth } from '../firebase';

export default function LoginScreen({ navigation: { navigate } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Toast.show({
        text: "Email or password is missing",
        buttonText: "OK",
        type: "danger"
      });
      return;
    }
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
    }
    catch (e) {
      setLoading(false);
      Toast.show({
        text: e.message,
        buttonText: "OK",
        type: "danger"
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 150, resizeMode: 'contain' }}
            source={{ uri: 'https://www.pngonly.com/wp-content/uploads/2017/05/Bismillah-PNG-File-Transparent-001.png' }}
          />
        </View>
        <Form style={styles.formContainer}>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input value={password} onChangeText={setPassword} secureTextEntry={true} />
          </Item>
          <View style={styles.forgotPwdContainer}>
            <Text styles={styles.forgotPwdText}>Forgot password</Text>
          </View>
          <View style={styles.loginBtnContainer}>
            <AnimatedButton
              showLoading={loading}
              width={150}
              height={45}
              title="Login"
              titleFontSize={16}
              titleColor="rgb(255,255,255)"
              backgroundColor="rgb(29,18,121)"
              borderRadius={25}
              onPress={handleLogin}
            />
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>OR</Text>
          </View>

          <View style={styles.loginBtnContainer} s>
            <Button rounded info style={styles.loginBtn} onPress={() => navigate('Signup')}>
              <Text>Sign up</Text>
            </Button>
          </View>
        </Form>
      </View>
    </View>
  )
}

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    height: ScreenHeight,
    width: ScreenWidth,
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
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
  loginBtn: { flexDirection: 'column', width: 150 },
  forgotPwdContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  forgotPwdText: {
    color: '#000'
  },
  signUpLabelContainer: {
    marginTop: 25,
  },
  signUpLabel: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center'
  },
  hyperlink: {
    fontSize: 14,
    color: 'blue'
  }
});