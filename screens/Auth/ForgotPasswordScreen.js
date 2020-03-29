import React, { useState } from 'react';
import { StyleSheet, Platform, View, Picker, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { Form, Item, Input, Toast, InputGroup, Content, Button } from 'native-base';
import { Text, BoldText } from 'components';
import { auth, db } from 'firebaseDB';
import { Ionicons } from '@expo/vector-icons';
import { FORGOT } from 'assets/images';

export default function ForgotPasswordScreen({ navigation: { navigate } }) {
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Content style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={FORGOT} style={styles.image} />
            </View>

            <View style={styles.descriptionSection}>
              <BoldText style={styles.bold}>Forgot Your Password?</BoldText>
              <Text style={styles.text}>Please enter the email that you have used to register. We will send you an email to reset your password again!</Text>
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
              <Button rounded block style={styles.buttton}>
                <Text style={{ color: '#fff' }}>SUBMIT</Text>
              </Button>
            </View>
          </View>
        </View>
      </Content>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#68A854',
    height: 50
  }
});