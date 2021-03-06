import * as firebase from '@firebase/testing';
import * as fs from 'fs';
import * as path from 'path';

export default function rulesTests({ projectId, users }) {
  const adminApp = firebase.initializeAdminApp({
    projectId,
  });

  const userApps = {};

  for (const [username, userObj] of Object.entries(users)) {
    userApps[username] = firebase.initializeTestApp({
      projectId,
      auth: userObj,
    });
  }

  async function setup() {
    await Promise.all(
      ['Mais', 'Reis'].map((grocery) =>
        adminApp
          .firestore()
          .collection('randomWords')
          .doc('de')
          .collection('groceries')
          .add({
            word: grocery,
            rng: Math.random(),
          })
      )
    );
    await Promise.all(
      ['Apfel', 'Banane'].map((grocery) =>
        adminApp
          .firestore()
          .collection('randomWords')
          .doc('de')
          .collection('vegetables')
          .add({
            word: grocery,
            rng: Math.random(),
          })
      )
    );

    await adminApp
      .firestore()
      .collection('shops')
      .doc('default')
      .set({
        capacity: 20,
        maxShoppingTime: 15,
      });

    await firebase.loadFirestoreRules({
      projectId,
      rules: fs.readFileSync(
        path.resolve(__dirname, '../../firestore.rules'),
        'utf8'
      ),
    });
  }

  async function teardown() {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  }

  return {
    adminApp,
    userApps,
    setup,
    teardown,
  };
}
