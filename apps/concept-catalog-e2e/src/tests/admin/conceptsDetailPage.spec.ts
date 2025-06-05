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
        nb: `InternRel ${Math.random().toString(36).substring(2, 8)}`,
        nn: `InternRel ${Math.random().toString(36).substring(2, 8)}`,
        en: `InternalRel ${Math.random().toString(36).substring(2, 8)}`,
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Definition en ${Math.random().toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(Math.random() * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(Math.random() * 10), minor: Math.floor(Math.random() * 10), patch: Math.floor(Math.random() * 10) },
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
    abbreviatedLabel: `LBL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  };

  const relatedPublished: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: `PublisertRel ${Math.random().toString(36).substring(2, 8)}`,
        nn: `PublisertRel ${Math.random().toString(36).substring(2, 8)}`,
        en: `PublishedRel ${Math.random().toString(36).substring(2, 8)}`,
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Definition en ${Math.random().toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(Math.random() * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(Math.random() * 10), minor: Math.floor(Math.random() * 10), patch: Math.floor(Math.random() * 10) },
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
    abbreviatedLabel: `LBL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  };

  const relatedInternalId = await createConcept(apiRequestContext, relatedInternal);
  const relatedPublishedId = await createConcept(apiRequestContext, relatedPublished);
  await publishConcept(apiRequestContext, relatedPublishedId);

  const expected: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: `Begrep ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Omgrep ${Math.random().toString(36).substring(2, 8)}`,
        en: `Concept ${Math.random().toString(36).substring(2, 8)}`,
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: `Definisjon nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Definisjon nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Definition en ${Math.random().toString(36).substring(2, 8)}`,
      },
      kildebeskrivelse: {
        forholdTilKilde: 'egendefinert',
        kilde: [],
      },
    },
    kontaktpunkt: {
      harEpost: `user${Math.floor(Math.random() * 10000)}@example.com`,
      harTelefon: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    },
    versjonsnr: { major: Math.floor(Math.random() * 10), minor: Math.floor(Math.random() * 10), patch: Math.floor(Math.random() * 10) },
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
        nb: `Test beskrivelse nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Test beskrivelse nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Test description en ${Math.random().toString(36).substring(2, 8)}`
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
        nb: `Test beskrivelse nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Test beskrivelse nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Test description en ${Math.random().toString(36).substring(2, 8)}`
      },
      inndelingskriterium: { 
        nb: `Inndelingskriterium nb ${Math.random().toString(36).substring(2, 8)}`,
        nn: `Inndelingskriterium nn ${Math.random().toString(36).substring(2, 8)}`,
        en: `Division criterion en ${Math.random().toString(36).substring(2, 8)}`
      },
      relatertBegrep: `https://concept-catalog.staging.fellesdatakatalog.digdir.no/collections/${process.env.E2E_CATALOG_ID}/concepts/${relatedPublishedId}`
    }],
    interneFelt: null,
    abbreviatedLabel: `LBL${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
  };  

  const id = await createConcept(apiRequestContext, expected);
  await conceptsPage.detailPage.goto(`/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`);
  await conceptsPage.detailPage.checkAccessibility();
  await conceptsPage.detailPage.expectDetails(expected);
});
