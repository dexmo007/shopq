/* eslint-disable no-console */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = admin.initializeApp();

const load = (name) =>
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, name), { encoding: 'utf8' })
  );

const data = {
  groceries: load('groceries.json'),
  vegetables: load('vegetables.json'),
};

const items = Object.entries(data).map(([type, words]) => [
  type,
  words.map((word) => ({
    word,
    rng: Math.random(),
  })),
]);

const col = app
  .firestore()
  .collection('randomWords')
  .doc('de');

for (const [type, words] of items) {
  Promise.all(words.map((word) => col.collection(type).add(word)))
    .then((res) => {
      console.log(
        `Successfully written ${res.length} words to list de/${type}`
      );
    })
    .catch((error) => console.error(error));
}
