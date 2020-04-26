module.exports = {
  ...require('./jest.config'),
  setupFiles: ['<rootDir>/tests/rules/env-setup.js'],
  testMatch: ['**/tests/rules/**/*.spec.[jt]s?(x)'],
};
