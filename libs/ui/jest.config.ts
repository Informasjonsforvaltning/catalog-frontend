export default {
  displayName: "ui",
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
  coverageDirectory: "../../coverage/libs/ui",
  setupFilesAfterEnv: ["../../libs/utils/src/lib/tests/setupMocks.js"],
};
