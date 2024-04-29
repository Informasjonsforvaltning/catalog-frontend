/* eslint-disable */
export default {
  displayName: 'catalog-admin',
  preset: '../../jest.preset.js',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
    '@digdir/designsystemet-(theme|css)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/catalog-admin',
};
