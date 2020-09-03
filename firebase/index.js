import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Constants from 'expo-constants';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

firebase.initializeApp(Constants.manifest.extra.firebase);
//firebase.analytics();

export const db = firebase.firestore();
export const GeoPoint = firebase.firestore.GeoPoint;
export const auth = firebase.auth();

export async function signInWithFacebook() {
  const appId = Constants.manifest.extra.facebook.appId;
  const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs

  await Facebook.initializeAsync(appId, 'Wahdapp');

  const { type, token } = await Facebook.logInWithReadPermissionsAsync(appId, { permissions });

  switch (type) {
    case 'success': {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const facebookProfileData = await auth.signInWithCredential(credential);  // Sign in with Facebook credential
      await auth.useDeviceLanguage();

      // Do something with Facebook profile data
      // OR you have subscribed to auth state change, authStateChange handler will process the profile data

      return Promise.resolve({ type: 'success' });
    }
    case 'cancel': {
      return Promise.reject({ type: 'cancel' });
    }
  }
}

export async function signInWithGoogle() {
  const { type, accessToken } = await Google.logInAsync({
    androidClientId: Constants.manifest.extra.google.androidClientId,
    iosClientId: Constants.manifest.extra.google.iosClientId,
    iosStandaloneAppClientId: Constants.manifest.extra.google.iosStandaloneAppClientId,
    androidStandaloneAppClientId: Constants.manifest.extra.google.androidStandaloneAppClientId,
    scopes: ['profile', 'email'],
  });

  switch (type) {
    case 'success': {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
      const credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
      console.log({ credential })
      const googleProfileData = await auth.signInWithCredential(credential);  // Sign in with Facebook credential
      console.log({ googleProfileData })
      await auth.useDeviceLanguage();

      // Do something with Facebook profile data
      // OR you have subscribed to auth state change, authStateChange handler will process the profile data

      return Promise.resolve({ type: 'success' });
    }
    case 'cancel': {
      return Promise.reject({ type: 'cancel' });
    }
  }
}