const firebase = require('@firebase/testing');
const fs = require('fs');
const importRandomWords = require('./data/import-random-words');

async function test() {
  try {
    const adminApp = firebase.initializeAdminApp({
      projectId: 'my-test-project',
    });

    await importRandomWords(adminApp);

    await firebase.loadFirestoreRules({
      projectId: 'my-test-project',
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    });

    const userApp = firebase.initializeTestApp({
      projectId: 'my-test-project',
      auth: { uid: 'alice', email: 'alice@example.com' },
    });

    await firebase.assertSucceeds(
      userApp
        .firestore()
        .collection('randomWords')
        .doc('de')
        .collection('vegetables')
        .where('rng', '>=', 0.5)
        .orderBy('rng', 'asc')
        .limit(1)
        .get()
    );
    await firebase.assertSucceeds(
      userApp
        .firestore()
        .collection('randomWords')
        .doc('de')
        .collection('groceries')
        .where('rng', '>=', 0.5)
        .orderBy('rng', 'asc')
        .limit(1)
        .get()
    );

    await firebase.assertFails(
      userApp
        .firestore()
        .collection('randomWords')
        .doc('de')
        .collection('vegetables')
        .add({
          word: 'illegal',
          rng: 0.123456789,
        })
    );
  } finally {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  }
}

test();
