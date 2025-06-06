import * as crypto from 'crypto';
import { Concept, RelationSubtypeEnum, RelationTypeEnum } from '@catalog-frontend/types';
import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, publishConcept } from '../../utils/helpers';

runTestAsAdmin('test if the detail page renders correctly', async ({ conceptsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

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
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), minor: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), patch: Math.floor(crypto.randomInt(100000000, 1000000000) * 10) },
    merknad: {},
    merkelapp: [],
    eksempel: null,
    fagområde: null,
    fagområdeKoder: null,
    omfang: null,
    tillattTerm: null,
    frarådetTerm: null,
    gyldigFom: null,
    gyldigTom: null,
    seOgså: [],
    internBegrepsRelasjon: [],
    internSeOgså: [],
    internErstattesAv: [],
    erstattesAv: [],
    statusURI: 'http://publications.europa.eu/resource/authority/concept-status/DRAFT',
    assignedUser: null,
    begrepsRelasjon: [],
    interneFelt: null,
    abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
  };

  const relatedPublished: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: `PublisertRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `PublisertRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `PublishedRel ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), minor: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), patch: Math.floor(crypto.randomInt(100000000, 1000000000) * 10) },
    merknad: {},
    merkelapp: [],
    eksempel: null,
    fagområde: null,
    fagområdeKoder: null,
    omfang: null,
    tillattTerm: null,
    frarådetTerm: null,
    gyldigFom: null,
    gyldigTom: null,
    seOgså: [],
    internBegrepsRelasjon: [],
    internSeOgså: [],
    internErstattesAv: [],
    erstattesAv: [],
    statusURI: 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
    assignedUser: null,
    begrepsRelasjon: [],
    interneFelt: null,
    abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
  };

  const relatedInternalId = await createConcept(apiRequestContext, relatedInternal);
  const relatedPublishedId = await createConcept(apiRequestContext, relatedPublished);
  await publishConcept(apiRequestContext, relatedPublishedId);

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
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(crypto.randomInt(100000000, 1000000000) * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + crypto.randomInt(100000000, 1000000000) * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), minor: Math.floor(crypto.randomInt(100000000, 1000000000) * 10), patch: Math.floor(crypto.randomInt(100000000, 1000000000) * 10) },
    merknad: {},
    merkelapp: [],
    eksempel: null,
    fagområde: null,
    fagområdeKoder: null,
    omfang: null,
    tillattTerm: null,
    frarådetTerm: null,
    gyldigFom: null,
    gyldigTom: null,
    seOgså: [`https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`],
    internBegrepsRelasjon: [{
      relasjon: RelationTypeEnum.ASSOSIATIV,
      relasjonsType: RelationSubtypeEnum.OVERORDNET,
      beskrivelse: { 
        nb: `Test beskrivelse nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Test beskrivelse nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Test description en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`
      },
      relatertBegrep: relatedInternalId
    }],
    internSeOgså: [relatedInternalId],
    internErstattesAv: [relatedInternalId],
    erstattesAv: [`https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`],
    statusURI: 'http://publications.europa.eu/resource/authority/concept-status/DRAFT',
    assignedUser: null,
    begrepsRelasjon: [{
      relasjon: RelationTypeEnum.PARTITIV,
      relasjonsType: RelationSubtypeEnum.OMFATTER,
      beskrivelse: { 
        nb: `Test beskrivelse nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Test beskrivelse nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Test description en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`
      },
      inndelingskriterium: { 
        nb: `Inndelingskriterium nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `Inndelingskriterium nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `Division criterion en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`
      },
      relatertBegrep: `https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`
    }],
    interneFelt: null,
    abbreviatedLabel: `LBL${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 6).toUpperCase()}`,
  };  

  const id = await createConcept(apiRequestContext, expected);
  await conceptsPage.detailPage.goto(`/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`);
  await conceptsPage.detailPage.checkAccessibility();
  await conceptsPage.detailPage.expectDetails(expected);
});
