import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  ...JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG),
};

firebase.initializeApp(config);
