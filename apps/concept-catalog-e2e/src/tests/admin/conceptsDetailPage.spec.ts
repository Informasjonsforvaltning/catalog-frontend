import * as crypto from "crypto";
import {
  Concept,
  RelationSubtypeEnum,
  RelationTypeEnum,
} from "@catalog-frontend/types";
import { runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createConcept,
  getFields,
  getPublishedConcept,
  getUsers,
  uniqueString,
} from "../../utils/helpers";

runTestAsAdmin(
  "test if the detail page renders correctly",
  async ({ conceptsPage, playwright }) => {
    console.log(
      "[TEST] Starting test: test if the detail page renders correctly",
    );

    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    console.log("[TEST] Created API request context with admin storage state");

    const relatedInternal: Concept = {
      id: null,
      anbefaltTerm: {
        navn: {
          nb: `InternRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `InternRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `InternalRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
      },
      ansvarligVirksomhet: {
        id: "",
      },
      definisjon: {
        tekst: {
          nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
        ansvarligVirksomhet: {
          id: null,
        },
      },
      kontaktpunkt: {
        harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
        harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
      },
      versjonsnr: {
        major: crypto.randomInt(1, 100),
        minor: crypto.randomInt(1, 100),
        patch: crypto.randomInt(1, 100),
      },
      merknad: {},
      merkelapp: [],
      eksempel: undefined,
      fagområde: undefined,
      fagområdeKoder: undefined,
      omfang: undefined,
      tillattTerm: undefined,
      frarådetTerm: undefined,
      gyldigFom: null,
      gyldigTom: null,
      seOgså: [],
      internBegrepsRelasjon: [],
      internSeOgså: [],
      internErstattesAv: [],
      erstattesAv: [],
      statusURI:
        "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
      assignedUser: undefined,
      begrepsRelasjon: [],
      interneFelt: undefined,
      abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
    };

    console.log("[TEST] Creating related internal concept...");
    const relatedInternalId = await createConcept(
      apiRequestContext,
      relatedInternal,
    );
    console.log(
      `[TEST] Related internal concept created with id: ${relatedInternalId}`,
    );

    console.log("[TEST] Fetching published concept...");
    let publishedConcept = await getPublishedConcept(apiRequestContext);
    if (!publishedConcept) {
      publishedConcept = {
        id: null,
        anbefaltTerm: {
          navn: {
            nb: `PublisertRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            nn: `PublisertRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            en: `PublishedRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          },
        },
        ansvarligVirksomhet: {
          id: "",
        },
        definisjon: {
          tekst: {
            nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          },
          kildebeskrivelse: {
            forholdTilKilde: "egendefinert",
            kilde: [],
          },
        },
        kontaktpunkt: {
          harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
          harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
        },
        versjonsnr: {
          major: crypto.randomInt(1, 100),
          minor: crypto.randomInt(1, 100),
          patch: crypto.randomInt(1, 100),
        },
        merknad: {},
        merkelapp: [],
        eksempel: undefined,
        fagområde: undefined,
        fagområdeKoder: undefined,
        omfang: null,
        tillattTerm: undefined,
        frarådetTerm: undefined,
        gyldigFom: null,
        gyldigTom: null,
        seOgså: [],
        internBegrepsRelasjon: [],
        internSeOgså: [],
        internErstattesAv: [],
        erstattesAv: [],
        statusURI:
          "http://publications.europa.eu/resource/authority/concept-status/CURRENT",
        assignedUser: undefined,
        begrepsRelasjon: [],
        interneFelt: undefined,
        abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
      };
      const id = await createConcept(apiRequestContext, publishedConcept);
      (publishedConcept as any).id = id;
      console.log(`[TEST] Created published concept with id: ${id}`);
    }
    const relatedPublishedId = [publishedConcept.id];

    console.log("[TEST] Fetching fields...");
    const fields = await getFields(apiRequestContext);
    console.log("[TEST] Fields fetched:", fields);

    console.log("[TEST] Fetching users...");
    const { users } = await getUsers(apiRequestContext);
    console.log("[TEST] Users fetched:", users);

    const randomUser =
      users.length > 1
        ? users[crypto.randomInt(0, users.length - 1)]
        : users.length === 1
          ? users[0]
          : undefined;

    console.log("[TEST] Selected random user:", randomUser);

    const expected: Concept = {
      id: null,
      anbefaltTerm: {
        navn: {
          nb: `Begrep ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Omgrep ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
      },
      ansvarligVirksomhet: {
        id: "",
      },
      definisjon: {
        tekst: {
          nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
        ansvarligVirksomhet: {
          id: null,
        },
      },
      kontaktpunkt: {
        harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
        harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
      },
      versjonsnr: {
        major: crypto.randomInt(1, 100),
        minor: crypto.randomInt(1, 100),
        patch: crypto.randomInt(1, 100),
      },
      merknad: {},
      merkelapp: [],
      eksempel: undefined,
      fagområde: undefined,
      fagområdeKoder: undefined,
      omfang: null,
      tillattTerm: undefined,
      frarådetTerm: undefined,
      gyldigFom: null,
      gyldigTom: null,
      seOgså: [
        `https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`,
      ],
      internBegrepsRelasjon: [
        {
          relasjon: RelationTypeEnum.ASSOSIATIV,
          relasjonsType: RelationSubtypeEnum.OVERORDNET,
          beskrivelse: {
            nb: `Test beskrivelse nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            nn: `Test beskrivelse nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            en: `Test description en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          },
          relatertBegrep: relatedInternalId,
        },
      ],
      internSeOgså: [relatedInternalId],
      internErstattesAv: [relatedInternalId],
      erstattesAv: [
        `https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`,
      ],
      statusURI:
        "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
      assignedUser: randomUser?.id,
      begrepsRelasjon: [
        {
          relasjon: RelationTypeEnum.PARTITIV,
          relasjonsType: RelationSubtypeEnum.OMFATTER,
          beskrivelse: {
            nb: `Test beskrivelse nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            nn: `Test beskrivelse nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            en: `Test description en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          },
          inndelingskriterium: {
            nb: `Inndelingskriterium nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            nn: `Inndelingskriterium nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
            en: `Division criterion en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          },
          relatertBegrep: `https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`,
        },
      ],
      interneFelt: fields.internal.reduce(
        (acc, field) => {
          if (field.type === "text_short" || field.type === "text_long") {
            acc[field.id] = { value: uniqueString("Internal_") };
          } else if (field.type === "boolean") {
            acc[field.id] = {
              value: crypto.randomInt(1, 10) > 5 ? "true" : "false",
            };
          } else if (field.type === "code_list") {
            //TODO
          } else if (field.type === "user_list") {
            acc[field.id] = { value: randomUser?.id ?? "" };
          }
          return acc;
        },
        {} as Record<string, { value: string }>,
      ),
      abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
    };

    console.log("[TEST] Creating expected concept...");
    const id = await createConcept(apiRequestContext, expected);
    console.log(`[TEST] Expected concept created with id: ${id}`);

    const detailUrl = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`;
    console.log(`[TEST] Navigating to detail page: ${detailUrl}`);
    await conceptsPage.detailPage.goto(detailUrl);

    console.log("[TEST] Checking accessibility on detail page...");
    await conceptsPage.detailPage.checkAccessibility();

    console.log("[TEST] Expecting details to match expected concept...");
    await conceptsPage.detailPage.expectDetails(expected, apiRequestContext);

    console.log(
      "[TEST] Test completed: test if the detail page renders correctly",
    );
  },
);
