const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { setDiff } = require('./utils');

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

exports.updateUserRoles = functions.firestore
  .document('shopControl/{shopId}')
  .onWrite(async (change, context) => {
    const changes = [];
    function pushChanges(field, uids, changeFieldValue) {
      const theseChanges = (uids || []).map((uid) =>
        admin
          .firestore()
          .collection('userInfos')
          .doc(uid)
          .set(
            {
              [field]: changeFieldValue(context.params.shopId),
            },
            { merge: true }
          )
      );
      changes.push.apply(changes, theseChanges);
    }
    const remove = admin.firestore.FieldValue.arrayRemove;
    const add = admin.firestore.FieldValue.arrayUnion;
    if (!change.after.exists) {
      // delete
      const { admins, admittance } = change.before.data();
      pushChanges('administeredShops', admins, remove);
      pushChanges('admittance', admittance, remove);
    } else if (!change.before.exists) {
      // create
      const { admins, admittance } = change.after.data();
      pushChanges('administeredShops', admins, add);
      pushChanges('admittance', admittance, add);
    } else {
      // update
      const {
        admins: beforeAdmins,
        admittance: beforeAdmittance,
      } = change.before.data();
      const {
        admins: afterAdmins,
        admittance: afterAdmittance,
      } = change.after.data();
      const { added: addedAdmins, removed: removedAdmins } = setDiff(
        beforeAdmins,
        afterAdmins
      );
      const { added: addedAdmittance, removed: removedAdmittance } = setDiff(
        beforeAdmittance,
        afterAdmittance
      );
      pushChanges('administeredShops', addedAdmins, add);
      pushChanges('admittance', addedAdmittance, add);
      pushChanges('administeredShops', removedAdmins, remove);
      pushChanges('admittance', removedAdmittance, remove);
    }

    // finalize
    await Promise.all(changes);
  });
