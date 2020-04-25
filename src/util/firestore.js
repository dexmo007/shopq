import firebase from 'firebase/app';

export function deleteIfAbsent(value) {
  return value ? value : firebase.firestore.FieldValue.delete();
}
