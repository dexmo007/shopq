const admin = require('firebase-admin');
const importRandomWords = require('./import-random-words');

const app = admin.initializeApp();

importRandomWords(app);
