 module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: ['node_modules', 'components'],
  testMatch: ['**/__tests__/*.test.js'],

   moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/services/$1"
  },
};
