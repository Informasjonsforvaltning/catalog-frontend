import { Concept } from '@catalog-frontend/types';
import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept } from '../../utils/helpers';

runTestAsAdmin('test if updating an existing concept saves correctly', async ({ conceptsPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const concept: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: 'Test concept 2 nb',
        nn: 'Test concept 2 nn',
        en: 'Test concept 2 en',
      },
    },
    ansvarligVirksomhet: {
      id: null,
    },
    definisjon: {
      tekst: {
        nb: 'This is a test concept 2 nb',
        nn: 'This is a test concept 2 nn',
        en: 'This is a test concept 2 en',
      },
      kildebeskrivelse: {
        forholdTilKilde: 'basertPaaKilde',
        kilde: [
          {
            tekst: 'Kilde concept 2',
            uri: 'https://kilde.concept2.no',
          },
        ],
      },
    },
    kontaktpunkt: {
      harEpost: 'test2@example.com',
      harTelefon: '123456789',
      //: 'https://test2.contactpage.com',
    },
    versjonsnr: { major: 1, minor: 2, patch: 1 },
    merknad: {
      nb: 'Merknad test concept 2 nb',
      nn: 'Merknad test concept 2 nn',
      en: 'Merknad test concept 2 en',
    },
    merkelapp: ['merkelapp1', 'merkelapp2'],
    eksempel: {
      nb: 'Eksempel test concept 2 nb',
      nn: 'Eksempel test concept 2 nn',
      en: 'Eksempel test concept 2 en',
    },
    fagområde: null,
    fagområdeKoder: null,
    omfang: {
      tekst: 'Omfang concept 2',
      uri: 'https://omfang.concept2.no',
    },
    tillattTerm: {
      nb: ['tillat-term1 nb', 'tillat-term2 nb'],
      nn: ['tillat-term1 nn', 'tillat-term2 nn'],
      en: ['tillat-term1 en', 'tillat-term2 en'],
    },
    frarådetTerm: {
      nb: ['frarådet-term1 nb', 'frarådet-term2 nb'],
      nn: ['frarådet-term1 nn', 'frarådet-term2 nn'],
      en: ['frarådet-term1 en', 'frarådet-term2 en'],
    },
    gyldigFom: '2199-01-01',
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
    abbreviatedLabel: 'TC2',
  };

  const updatedConcept = {
    ...concept,
    ...{
      anbefaltTerm: {
        navn: {
          nb: 'Test concept 2 nb',
          nn: 'Test concept 2 nn - updated',
          en: 'Test concept 2 en - updated',
        },
      },
      definisjon: {
        tekst: {
          nb: 'This is a test concept 2 nb',
          nn: 'This is a test concept 2 nn - updated',
          en: 'This is a test concept 2 en - updated',
        },
        kildebeskrivelse: {
          forholdTilKilde: 'basertPaaKilde',
          kilde: [
            {
              tekst: 'Kilde concept 2 - updated',
              uri: 'https://kilde.concept2.no/updated',
            },
          ],
        },
      },
      kontaktpunkt: {
        harEpost: 'test2@example-updated.com',
        harTelefon: '123456781',
        //: 'https://test2.contactpage.com',
      },
      versjonsnr: { major: 1, minor: 2, patch: 1 },
      merknad: {
        nb: 'Merknad test concept 2 nb - updated',
        nn: 'Merknad test concept 2 nn - updated',
        en: 'Merknad test concept 2 en - updated',
      },
      merkelapp: ['merkelapp1-updated', 'merkelapp2-updated'],
      eksempel: {
        nb: 'Eksempel test concept 2 nb - updated',
        nn: 'Eksempel test concept 2 nn - updated',
        en: 'Eksempel test concept 2 en - updated',
      },
      fagområde: null,
      fagområdeKoder: null,
      omfang: {
        tekst: 'Omfang concept 2 - updated',
        uri: 'https://omfang.concept2.no/updated',
      },
      tillattTerm: {
        nb: ['tillat-term1 nb - updated', 'tillat-term2 nb - updated'],
        nn: ['tillat-term1 nn - updated', 'tillat-term2 nn - updated'],
        en: ['tillat-term1 en - updated', 'tillat-term2 en - updated'],
      },
      frarådetTerm: {
        nb: ['frarådet-term1 nb - updated', 'frarådet-term2 nb - updated'],
        nn: ['frarådet-term1 nn - updated', 'frarådet-term2 nn - updated'],
        en: ['frarådet-term1 en - updated', 'frarådet-term2 en - updated'],
      },
      gyldigFom: '2199-01-01',
      gyldigTom: '2299-01-01',
      seOgså: [],
      internBegrepsRelasjon: [],
      internSeOgså: [],
      internErstattesAv: [],
      erstattesAv: [],
      statusURI: 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
      assignedUser: null,
      begrepsRelasjon: [],
      interneFelt: null,
      abbreviatedLabel: 'TC2UPDATED',
    },
  };

  const id = await createConcept(apiRequestContext, concept);

  await conceptsPage.detailPage.goto(`/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`);
  await conceptsPage.detailPage.editConcept();
  await conceptsPage.editPage.checkAccessibility();
  await conceptsPage.editPage.fillFormAndSave(updatedConcept, true);
  await conceptsPage.detailPage.goto(`/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`);
  await conceptsPage.detailPage.expectDetails(updatedConcept);
});
