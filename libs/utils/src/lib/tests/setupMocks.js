// Mocks next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ query: {} }),
}));

// Mocks react-localization
jest.mock("react-localization", () => {
  return jest.fn().mockImplementation((translations) => {
    let currentLanguage = "nb";

    return {
      setLanguage: jest.fn((language) => {
        currentLanguage = language;
      }),
      getLanguage: jest.fn(() => currentLanguage),
      getString: jest.fn((key) => {
        const keys = key.split(".");
        let value = translations[currentLanguage];
        for (const k of keys) {
          value = value ? value[k] : null;
        }
        return value || key;
      }),
      ...translations[currentLanguage],
    };
  });
});
