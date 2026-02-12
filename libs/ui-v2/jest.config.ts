export default {
  displayName: "ui-v2",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]sx?$": [
      "@swc/jest",
      { jsc: { transform: { react: { runtime: "automatic" } } } },
    ],
  },
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svg.ts",
    "react-markdown": "<rootDir>/__mocks__/empty-mock.ts",
    "remark-gfm": "<rootDir>/__mocks__/empty-mock.ts",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/libs/ui-v2",
  setupFilesAfterEnv: ["../../libs/utils/src/lib/tests/setupMocks.js"],
};
