import React, { useState } from 'react';
import { StyleSheet, Platform, View, Dimensions } from 'react-native';
import { Form, Item, Input, Label, Segment, Text, Toast, Button } from 'native-base';
import AnimatedButton from 'components/AnimatedButton';
import { auth, db } from 'firebaseDB';

export default function SignupScreen({ navigation: { navigate } }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [gender, setGender] = useState('M');

  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!fullName || !email || !password || !confirm) {
      Toast.show({
        text: "You have one or more fields missing",
        buttonText: "OK",
        type: "danger"
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        text: "Two passwords do not match",
        buttonText: "OK",
        type: "danger"
      });
      return;
    }

    try {
      setLoading(true);
      const authUser = await auth.createUserWithEmailAndPassword(email, password);
      db.collection('users').doc(authUser.user.uid).set({
        fullName,
        email,
        gender,
      });
    }
    catch (e) {
      console.error({ e })
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
      <View style={styles.signupContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create an account</Text>
        </View>
        <Form style={styles.formContainer}>
          <Item floatingLabel>
            <Label>Full Name</Label>
            <Input value={fullName} onChangeText={setFullName} />
          </Item>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input value={email} onChangeText={setEmail} />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input value={password} onChangeText={setPassword} secureTextEntry={true} />
          </Item>
          <Item floatingLabel>
            <Label>Confirm Password</Label>
            <Input value={confirm} onChangeText={setConfirm} secureTextEntry={true} />
          </Item>
          <Segment style={styles.segment}>
            <Button active={gender === 'M'} onPress={() => setGender('M')} style={{ backgroundColor: gender === 'M' ? '#1d1279' : 'white' }}>
              <Text style={{ color: gender === 'M' ? 'white' : '#1d1279' }}>Male</Text>
            </Button>
            <Button active={gender === 'F'} onPress={() => setGender('F')} style={{ backgroundColor: gender === 'F' ? '#1d1279' : 'white' }}>
              <Text style={{ color: gender === 'F' ? 'white' : '#1d1279' }}>Female</Text>
            </Button>
          </Segment>

          <View style={styles.signupBtnContainer}>
            <AnimatedButton
              showLoading={loading}
              width={150}
              height={45}
              title="Signup"
              titleFontSize={16}
              titleColor="rgb(255,255,255)"
              backgroundColor="rgb(29,18,121)"
              borderRadius={25}
              onPress={handleSignup}
            />
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
  signupContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  titleContainer: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    paddingLeft: 25,
    paddingRight: 25,
    width: '100%'
  },
  signupBtnContainer: {
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center'
  },
  signupBtn: { flexDirection: 'column', width: 150 },
  segment: {
    marginTop: 25,
    backgroundColor: 'white',
  },
});