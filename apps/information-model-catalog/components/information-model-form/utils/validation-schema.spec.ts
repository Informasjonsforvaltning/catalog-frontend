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
          hasFormatSeeAlso: "url",
        },
        validation: {
          description: "description too short",
          contactPoints: "contact points required",
          version: "version incomplete",
          date: "invalid date",
          relation: "relation incomplete",
        },
      },
    },
  };
});

import { InformationModel } from "@catalog-frontend/types";
import { informationModelTemplate } from "./information-model-initial-values";
import {
  draftInformationModelValidationSchema,
  informationModelValidationSchema,
  modelDocumentSchema,
  resourceRelationSchema,
} from "./validation-schema";

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

describe("resourceRelationSchema", () => {
  test("accepts a valid relation type and source", async () => {
    await expect(
      resourceRelationSchema.isValid({
        type: "http://purl.org/dc/terms/replaces",
        source: "https://example.com/information-models/old",
      }),
    ).resolves.toBe(true);
  });

  test("rejects an unknown relation type", async () => {
    await expect(
      resourceRelationSchema.isValid({
        type: "http://example.com/unknown-relation",
        source: "https://example.com/information-models/old",
      }),
    ).resolves.toBe(false);
  });

  test("rejects a missing type", async () => {
    await expect(
      resourceRelationSchema.isValid({
        type: "",
        source: "https://example.com/information-models/old",
      }),
    ).resolves.toBe(false);
  });

  test("rejects a missing source", async () => {
    await expect(
      resourceRelationSchema.isValid({
        type: "http://purl.org/dc/terms/replaces",
        source: "",
      }),
    ).resolves.toBe(false);
  });
});

describe("modelDocumentSchema", () => {
  test("accepts a document with https seeAlso", async () => {
    await expect(
      modelDocumentSchema.isValid({
        title: { nb: "PNG-visning" },
        language:
          "http://publications.europa.eu/resource/authority/language/NOB",
        format:
          "http://publications.europa.eu/resource/authority/file-type/PNG",
        seeAlso: "https://example.com/models/model-1.png",
      }),
    ).resolves.toBe(true);
  });

  test("accepts a document without seeAlso", async () => {
    await expect(
      modelDocumentSchema.isValid({
        title: { nb: "PNG-visning" },
        language: "",
        format: "",
        seeAlso: "",
      }),
    ).resolves.toBe(true);
  });

  test("rejects a seeAlso that does not use https", async () => {
    await expect(
      modelDocumentSchema.isValid({
        title: { nb: "PNG-visning" },
        seeAlso: "http://example.com/models/model-1.png",
      }),
    ).resolves.toBe(false);
  });

  test("rejects an invalid seeAlso url", async () => {
    await expect(
      modelDocumentSchema.isValid({
        title: { nb: "PNG-visning" },
        seeAlso: "https://",
      }),
    ).resolves.toBe(false);
  });
});

describe("hasFormat seeAlso https requirement", () => {
  const modelWithHttpSeeAlso = informationModelTemplate({
    ...publishableFromApi,
    hasFormat: [
      {
        title: { nb: "PNG-visning" },
        seeAlso: "http://example.com/models/model-1.png",
      },
    ],
  } as InformationModel);

  test("draft schema rejects http seeAlso", async () => {
    await expect(
      draftInformationModelValidationSchema().isValid(modelWithHttpSeeAlso),
    ).resolves.toBe(false);
  });

  test("confirm schema rejects http seeAlso", async () => {
    await expect(
      informationModelValidationSchema().isValid(modelWithHttpSeeAlso),
    ).resolves.toBe(false);
  });
});
