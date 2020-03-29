import React, { useState } from 'react';
import { StyleSheet, Platform, View, Picker, ScrollView } from 'react-native';
import { Form, Item, Input, Toast, InputGroup, Card } from 'native-base';
import { Text, BoldText } from 'components';
import AnimatedButton from 'components/AnimatedButton';
import { auth, db } from 'firebaseDB';
import { Ionicons } from '@expo/vector-icons';

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
        textStyle: { fontSize: 12 },
        buttonText: "OK",
        type: "danger"
      });
      return;
    }

    if (password !== confirm) {
      Toast.show({
        text: "Two passwords do not match",
        textStyle: { fontSize: 12 },
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
        textStyle: { fontSize: 12 },
        buttonText: "OK",
        type: "danger"
      });
    }
  }

  return (
    <View style={styles.container} contentContainerStyle={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={styles.signupContainer}>
        <ScrollView style={{ width: '100%', height: '100%' }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
          </View>
          <View style={styles.formContainer}>
            <Form>
              <BoldText style={styles.inputLabel}>Full Name</BoldText>
              <InputGroup floatingLabel rounded style={styles.inputGroup}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
                <Input style={styles.input} value={fullName} onChangeText={setFullName} />
              </InputGroup>

              <BoldText style={styles.inputLabel}>Email Address</BoldText>
              <InputGroup floatingLabel rounded style={styles.inputGroup}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-mail' : 'md-mail'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
                <Input style={styles.input} value={email} onChangeText={setEmail} />
              </InputGroup>

              <BoldText style={styles.inputLabel}>Password</BoldText>
              <InputGroup floatingLabel rounded style={styles.inputGroup}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-lock' : 'md-lock'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
                <Input style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={true} />
              </InputGroup>

              <BoldText style={styles.inputLabel}>Confirm Password</BoldText>
              <InputGroup floatingLabel rounded style={styles.inputGroup}>
                <Ionicons name={Platform.OS === 'ios' ? 'ios-lock' : 'md-lock'} size={25} color="#DDD" style={{ paddingLeft: 10 }} />
                <Input style={styles.input} value={confirm} onChangeText={setConfirm} secureTextEntry={true} />
              </InputGroup>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                <Picker style={{ width: '100%' }} itemStyle={{ height: 100 }} selectedValue={gender} onValueChange={item => setGender(item)}>
                  <Picker.Item label="Male" value="M" />
                  <Picker.Item label="Female" value="F" />
                </Picker>
              </View>

              <View style={styles.signupBtnContainer}>
                <AnimatedButton
                  showLoading={loading}
                  width={150}
                  height={45}
                  title="SIGN UP"
                  titleFontSize={14}
                  titleFontFamily="Sen"
                  titleColor="rgb(255,255,255)"
                  backgroundColor="#12967A"
                  borderRadius={25}
                  onPress={handleSignup}
                />
              </View>
            </Form>
          </View>
        </ScrollView>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12967A',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    padding: 25,
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
    marginTop: 25,
    width: '100%'
  },
  signupBtnContainer: {
    marginTop: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center'
  },
  signupBtn: { alignItems: 'center', justifyContent: 'center', minWidth: 150 },
  inputLabel: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10
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