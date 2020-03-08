import React from 'react';
import { StyleSheet, Platform, View, Image, Dimensions } from 'react-native';
import { Form, Item, Input, Label, Button, Text } from 'native-base';

export default function SignupScreen({ navigation: { navigate } }) {
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
            <Input />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input />
          </Item>
          <View style={styles.loginBtnContainer} s>
            <Button rounded info style={styles.loginBtn}>
              <Text>Login</Text>
            </Button>
          </View>

          <View style={styles.signUpLabelContainer}>
            <Text style={styles.signUpLabel}>OR</Text>
          </View>

          <View style={styles.loginBtnContainer} s>
            <Button rounded info style={styles.loginBtn} onPress={() => navigate('')}>
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
    backgroundColor: '#12D2AB',
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
  signUpLabelContainer: {
    marginTop: 25,
  },
  signUpLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  },
  hyperlink: {
    fontSize: 14,
    color: 'blue'
  }
});