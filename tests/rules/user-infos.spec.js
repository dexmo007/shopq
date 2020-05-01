import rulesTests from './init';

const { userApps, setup, teardown } = rulesTests({
  projectId: 'rules-tests-user-infos',
  users: {
    plain: {
      uid: 'plain',
      email: 'plain@example.com',
      firebase: {
        sign_in_provider: 'email',
      },
    },
    anon: {
      uid: 'anon',
      isAnonymous: true,
      firebase: {
        sign_in_provider: 'anonymous',
      },
    },
  },
});

describe('Firestore rules / user infos', () => {
  beforeAll(setup);

  it('should allow write of own info for logged in user', async () => {
    expect.assertions(1);
    await expect(
      userApps.plain
        .firestore()
        .collection('userInfos')
        .doc('plain')
        .set({
          foo: 'bar',
        })
    ).resolves.toBeUndefined();
  });

  it('should allow read of own info for logged in user', async () => {
    expect.assertions(1);
    await expect(
      userApps.plain
        .firestore()
        .collection('userInfos')
        .doc('plain')
        .get()
    ).resolves.toEqual(expect.anything());
  });

  it('should deny read access to anonymous user', async () => {
    expect.assertions(1);
    await expect(
      userApps.anon
        .firestore()
        .collection('userInfos')
        .doc('anon')
        .get()
    ).rejects.toThrowError(expect.anything());
  });

  it('should deny write access to anonymous user', async () => {
    expect.assertions(1);
    await expect(
      userApps.anon
        .firestore()
        .collection('userInfos')
        .doc('anon')
        .set({
          name: 'hacker',
        })
    ).rejects.toThrowError(/PERMISSION_DENIED/);
  });

  afterAll(teardown);
});
