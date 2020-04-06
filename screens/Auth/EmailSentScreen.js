import React, { useState } from 'react';
import { StyleSheet, Platform, View, Picker, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { Form, Item, Input, Toast, InputGroup, Content, Button } from 'native-base';
import { Text, BoldText } from 'components';
import { Ionicons } from '@expo/vector-icons';
import { EMAIL_SENT } from 'assets/images';
import { useTranslation } from 'react-i18next';
import colors from 'constants/Colors';

export default function EmailSentScreen({ navigation: { navigate } }) {

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <Content style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.imageContainer}>
              <Image source={EMAIL_SENT} style={styles.image} />
            </View>

            <View style={styles.descriptionSection}>
              <BoldText style={styles.bold}>Verify Your Email Address</BoldText>
              <Text style={styles.text}>An verification email has been sent to your inbox. Please follow the necessary steps to start your journey!</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button rounded block style={styles.button} onPress={() => navigate('Login')}>
                <Text style={{ color: '#fff' }}>BACK TO LOGIN</Text>
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
    backgroundColor: colors.secondary,
    height: 52
  }
});