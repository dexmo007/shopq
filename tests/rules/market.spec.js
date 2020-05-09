import rulesTests from './init';

const { userApps, setup, teardown } = rulesTests({
  projectId: 'rules-tests-market',
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

describe('Firestore rules / market', () => {
  beforeAll(setup);

  it('should work', () => {});

  afterAll(teardown);
});
