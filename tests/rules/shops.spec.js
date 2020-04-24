import rulesTests from './init';

const { userApps, setup, teardown } = rulesTests({
  projectId: 'rules-tests-shop',
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

describe('Firestore rules / shops', () => {
  beforeAll(setup);

  it.each([
    ['logged in user', userApps.plain],
    ['anonymous user', userApps.anon],
  ])(
    'should allow read access to the default shop for a %s',
    async (name, userApp) => {
      expect.assertions(1);
      await expect(
        userApp
          .firestore()
          .collection('shops')
          .doc('default')
          .get()
      ).resolves.toEqual(expect.anything());
    }
  );

  it.each([
    ['logged in user', userApps.plain],
    ['anonymous user', userApps.anon],
  ])(
    'should deny write access to the default shop for a %s',
    async (name, userApp) => {
      expect.assertions(1);
      await expect(
        userApp
          .firestore()
          .collection('shops')
          .doc('default')
          .set({
            name: 'hacker',
          })
      ).rejects.toThrowError(/PERMISSION_DENIED/);
    }
  );

  afterAll(teardown);
});
