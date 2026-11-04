import { InformationModelToBeCreated } from "@catalog-frontend/types";
import { getRunTitlePrefix, uniqueString } from "./helpers";

export type Language = "nb" | "nn" | "en";

export type TextByLanguage = Partial<Record<Language, string>>;

export type TestInformationModel = InformationModelToBeCreated & {
  title: Required<TextByLanguage>;
  description: Required<TextByLanguage>;
  contactPoints: [{ name: { nb: string }; email: string }];
};

export const testTitle = (suffix: string) =>
  uniqueString(`${getRunTitlePrefix()}${suffix}`);

export const getRandomInformationModel = (): TestInformationModel => ({
  title: {
    nb: testTitle("nb"),
    nn: testTitle("nn"),
    en: testTitle("en"),
  },
  description: {
    nb: uniqueString("description_nb"),
    nn: uniqueString("description_nn"),
    en: uniqueString("description_en"),
  },
  contactPoints: [
    {
      name: { nb: "Test Kontakt" },
      email: "test@example.com",
    },
  ],
});
