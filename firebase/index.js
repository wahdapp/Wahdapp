import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Constants from 'expo-constants';
import * as Facebook from 'expo-facebook';

firebase.initializeApp(Constants.manifest.extra.firebase);
//firebase.analytics();

export const db = firebase.firestore();
export const GeoPoint = firebase.firestore.GeoPoint;
export const auth = firebase.auth();

export async function signInWithFacebook() {
  console.log(Constants.manifest.extra)
  const appId = Constants.manifest.extra.facebook.appId;
  const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs

  const { type, token } = await Facebook.logInWithReadPermissionsAsync(appId, { permissions });

  switch (type) {
    case 'success': {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const facebookProfileData = await auth.signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential

      // Do something with Facebook profile data
      // OR you have subscribed to auth state change, authStateChange handler will process the profile data

      return Promise.resolve({ type: 'success' });
    }
    case 'cancel': {
      return Promise.reject({ type: 'cancel' });
    }
  }
}