import firebase from 'firebase/app';
// import 'firebase/auth';
// import 'firebase/storage';
import 'firebase/firestore';
// import 'firebase/functions';
// import 'firebase/performance';

const config = {
  apiKey: 'AIzaSyAT9sc-tJf7EiEYi6rvi6zB1Rlwln_UF8c',
  authDomain: 'shopq-271815.firebaseapp.com',
  databaseURL: 'https://shopq-271815.firebaseio.com',
  projectId: 'shopq-271815',
  storageBucket: 'shopq-271815.appspot.com',
  messagingSenderId: '169605879088',
  appId: '1:169605879088:web:9217f73b587e401582a4f5',
  measurementId: 'G-EDF2ZX62M0',
};

firebase.initializeApp(config);
