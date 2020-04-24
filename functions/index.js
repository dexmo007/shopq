const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateQueueCounter = functions.firestore
  .document('queues/{shopId}/users/{userId}')
  .onWrite((change, context) => {
    if (change.before.exists && change.after.exists) {
      return true;
    }
    return admin
      .firestore()
      .doc(`shops/${context.params.shopId}`)
      .update({
        queueCounter: admin.firestore.FieldValue.increment(
          change.after.exists ? 1 : -1
        ),
      });
  });
