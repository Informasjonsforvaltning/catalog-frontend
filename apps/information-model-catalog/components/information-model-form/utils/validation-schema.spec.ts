jest.mock("@catalog-frontend/utils", () => {
  const version = jest.requireActual(
    "../../../../../libs/utils/src/lib/version",
  );
  const date = jest.requireActual(
    "../../../../../libs/utils/src/lib/date/format",
  );
  const regex = jest.requireActual(
    "../../../../../libs/utils/src/lib/regex/regex",
  );

  return {
    normalizeVersion: version.normalizeVersion,
    parseDateTime: date.parseDateTime,
    httpsRegex: regex.httpsRegex,
    telephoneNumberRegex: regex.telephoneNumberRegex,
    localization: {
      language: { nb: "nb", nn: "nn", en: "en" },
      validation: {
        oneLanguageRequired: "one language required",
        invalidEmail: "invalid email",
        invalidPhone: "invalid phone",
        invalidProtocol: "invalid protocol",
        invalidUrl: "invalid url",
      },
      informationModelForm: {
        fieldLabel: {
          title: "title",
          description: "description",
          homepage: "homepage",
          contactName: "contact name",
        },
        validation: {
          description: "description too short",
          contactPoints: "contact points required",
          version: "version incomplete",
          date: "invalid date",
        },
      },
    },
  };
});

import { InformationModel } from "@catalog-frontend/types";
import { informationModelTemplate } from "./information-model-initial-values";
import { informationModelValidationSchema } from "./validation-schema";

const publishableFromApi = {
  id: "c40dfa35-5753-4db9-a918-2257ee0b32c9",
  catalogId: "555111098",
  published: false,
  title: { nb: "Gyldig modell" },
  description: { nb: "En beskrivelse" },
  contactPoints: [
    {
      name: { nb: "Kontakt" },
      email: "kontakt@example.com",
      telephone: null,
      url: null,
    },
  ],
  status: null,
  homepage: null,
  version: null,
  creator: null,
  subjects: null,
  issued: "2026-01-10",
  modified: "2026-03-15T00:00:00Z",
} as InformationModel;

describe("informationModelValidationSchema", () => {
  test("accepts a publishable API model after form template normalization", async () => {
    await expect(
      informationModelValidationSchema().isValid(
        informationModelTemplate(publishableFromApi),
      ),
    ).resolves.toBe(true);
  });

  test("rejects a model missing required contact information", async () => {
    const incomplete = {
      ...publishableFromApi,
      contactPoints: null,
    } as InformationModel;

    await expect(
      informationModelValidationSchema().isValid(
        informationModelTemplate(incomplete),
      ),
    ).resolves.toBe(false);
  });

  test("rejects an invalid homepage when present", async () => {
    const invalidHomepage = {
      ...publishableFromApi,
      homepage: "http://insecure.example.com",
    } as InformationModel;

    await expect(
      informationModelValidationSchema().isValid(
        informationModelTemplate(invalidHomepage),
      ),
    ).resolves.toBe(false);
  });
});
