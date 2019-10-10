import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyDMceVnG02LkHECfd7LRudD9dfxfJ7K7n8",
  authDomain: "jamaat-app-c75f3.firebaseapp.com",
  databaseURL: "https://jamaat-app-c75f3.firebaseio.com",
  projectId: "jamaat-app-c75f3",
  storageBucket: "jamaat-app-c75f3.appspot.com",
  messagingSenderId: "397539853913",
  appId: "1:397539853913:web:e9d78eccbf1f86d4005348",
  measurementId: "G-7LNP0NF58K"
};

firebase.initializeApp(config);
//firebase.analytics();

export const db = firebase.database();