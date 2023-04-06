module.exports = {
  verbose: false,
  testPathIgnorePatterns: ['<rootDir>/test.js'],
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  testRegex: '(?:\.spec|test)\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
}
