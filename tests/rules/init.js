import * as firebase from '@firebase/testing';
import * as fs from 'fs';
import * as path from 'path';
import importRandomWords from '../../data/import-random-words';

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
    await importRandomWords(adminApp, { supressLogs: true });

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
