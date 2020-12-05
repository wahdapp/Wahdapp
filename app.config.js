import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    "android": {
      "package": "com.wahdapp.wahdapp",
      "config": {
        "googleMaps": {
          "apiKey": process.env.ANDROID_GOOGLE_MAPS_API_KEY
        },
      },
      "googleServicesFile": "./google-services.json",
      "versionCode": 1,
      "splash": {
        "ldpi": "./assets/images/splash_screens/android/ldpi/splash.png",
        "mdpi": "./assets/images/splash_screens/android/mdpi/splash.png",
        "hdpi": "./assets/images/splash_screens/android/hdpi/splash.png",
        "xdpi": "./assets/images/splash_screens/android/xdpi/splash.png",
        "xxdpi": "./assets/images/splash_screens/android/xxdpi/splash.png",
        "xxxdpi": "./assets/images/splash_screens/android/xxxdpi/splash.png",
        "resizeMode": "cover"
      }
    },
    "ios": {
      "bundleIdentifier": "com.wahdapp.wahdapp",
      "supportsTablet": true,
      "googleServicesFile": "./GoogleService-Info.plist",
      "config": {
        "googleMapsApiKey": process.env.IOS_GOOGLE_MAPS_API_KEY,
      },
      "splash": {
        "image": "./assets/images/splash_screens/ios/splash.png",
        "resizeMode": "cover"
      },
      "infoPlist": {
        "UIBackgroundModes": ["location", "fetch"]
      }
    },
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "wahdapp",
            "project": "wahdapp",
            "authToken": process.env.SENTRY_TOKEN
          }
        }
      ]
    },
    "extra": {
      "firebase": {
        "apiKey": process.env.FIREBASE_API_KEY,
        "authDomain": process.env.FIREBASE_AUTH_DOMAIN,
        "databaseURL": process.env.FIREBASE_DATABASE_URL,
        "projectId": process.env.FIREBASE_PROJECT_ID,
        "storageBucket": process.env.FIREBASE_STORAGE_BUCKET,
        "messagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
        "appId": process.env.FIREBASE_APP_ID,
        "measurementId": process.env.FIREBASE_MEASUREMENT_ID,
      },
      "facebook": {
        "appId": process.env.FACEBOOK_APP_ID,
      },
      "google": {
        "iosClientId": process.env.GOOGLE_IOS_CLIENT_ID,
        "androidClientId": process.env.GOOGLE_ANDROID_CLIENT_ID,
        "iosStandaloneAppClientId": process.env.IOS_STANDALONE_CLIENT_ID,
        "androidStandaloneAppClientId": process.env.ANDROID_STANDALONE_CLIENT_ID
      }
    }
  };
};
