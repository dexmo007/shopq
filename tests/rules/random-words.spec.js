import rulesTests from './init';

const { userApps, setup, teardown } = rulesTests({
  projectId: 'rules-tests-random-words',
  users: {
    plain: {
      uid: 'plain',
      email: 'plain@example.com',
    },
    anon: {
      uid: 'anon',
      isAnonymous: true,
    },
  },
});

describe('Firestore rules / randomWords', () => {
  beforeAll(setup);

  it.each([
    ['logged in user', userApps.plain, 'groceries'],
    ['logged in user', userApps.plain, 'vegetables'],
    ['anonymous user', userApps.anon, 'groceries'],
    ['anonymous user', userApps.anon, 'vegetables'],
  ])(
    'should allow read access to the random words collection for a %s',
    async (name, userApp, wordType) => {
      expect.assertions(1);
      await expect(
        userApp
          .firestore()
          .collection('randomWords')
          .doc('de')
          .collection(wordType)
          .where('rng', '>=', 0.5)
          .orderBy('rng', 'asc')
          .limit(1)
          .get()
      ).resolves.toEqual(expect.anything());
    }
  );

  it.each([
    ['logged in user', userApps.plain, 'groceries'],
    ['logged in user', userApps.plain, 'vegetables'],
    ['anonymous user', userApps.anon, 'groceries'],
    ['anonymous user', userApps.anon, 'vegetables'],
  ])(
    'should deny write access to the random words collection for a %s',
    async (name, userApp, wordType) => {
      expect.assertions(2);
      await expect(
        userApp
          .firestore()
          .collection('randomWords')
          .doc('de')
          .collection(wordType)
          .add({
            word: 'illegal',
            rng: 0.123456789,
          })
      ).rejects.toThrowError(/PERMISSION_DENIED/);
      const snap = await userApp
        .firestore()
        .collection(`randomWords/de/${wordType}`)
        .limit(1)
        .get();

      await expect(
        snap.docs[0].ref.update({
          word: 'illegal',
        })
      ).rejects.toThrowError(/PERMISSION_DENIED/);
    }
  );

  afterAll(teardown);
});
