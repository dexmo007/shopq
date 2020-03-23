import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
  authDomain: 'shopq-271815.firebaseapp.com',
  databaseURL: 'https://shopq-271815.firebaseio.com',
  projectId: 'shopq-271815',
  storageBucket: 'shopq-271815.appspot.com',
  messagingSenderId: '169605879088',
  appId: '1:169605879088:web:9217f73b587e401582a4f5',
  measurementId: 'G-EDF2ZX62M0',
};

firebase.initializeApp(config);
