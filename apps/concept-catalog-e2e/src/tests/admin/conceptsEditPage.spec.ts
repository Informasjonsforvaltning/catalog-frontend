import * as crypto from 'crypto';
import { Concept } from '@catalog-frontend/types';
import { runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createConcept, getFields, getUsers, uniqueString } from '../../utils/helpers';

runTestAsAdmin('test if updating an existing concept saves correctly', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Starting test: test if updating an existing concept saves correctly');

  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  console.log('[TEST] Created API request context with admin storage state');

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

  console.log('[TEST] Fetching fields...');
  const fields = await getFields(apiRequestContext);
  console.log('[TEST] Fields fetched:', fields);

  console.log('[TEST] Fetching users...');
  const { users } = await getUsers(apiRequestContext);
  console.log('[TEST] Users fetched:', users);

  const randomUser =
    users.length > 1 ? users[crypto.randomInt(0, users.length - 1)] : users.length === 1 ? users[0] : undefined;

  console.log('[TEST] Selected random user:', randomUser);

  const updatedConcept = {
    ...concept,
    ...{
      anbefaltTerm: {
        navn: {
          nb: `Begrep ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Omgrep ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
      },
      definisjon: {
        tekst: {
          nb: `Definisjon nb ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Definisjon nn ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Definition en ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
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
      assignedUser: randomUser?.id,
      begrepsRelasjon: [],
      interneFelt: fields.internal.reduce(
        (acc, field) => {
          if (field.type === 'text_short' || field.type === 'text_long') {
            acc[field.id] = { value: uniqueString('Internal_') };
          } else if (field.type === 'boolean') {
            acc[field.id] = { value: crypto.randomInt(1, 10) > 5 ? 'true' : 'false' };
          } else if (field.type === 'code_list') {
            //TODO
          } else if (field.type === 'user_list') {
            acc[field.id] = { value: randomUser?.id };
          }
          return acc;
        },
        {} as Record<string, { value: string }>,
      ),
      abbreviatedLabel: 'TC2UPDATED',
    },
  };

  console.log('[TEST] Creating initial concept...');
  const id = await createConcept(apiRequestContext, concept);
  console.log(`[TEST] Concept created with id: ${id}`);

  const detailUrl = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`;
  console.log(`[TEST] Navigating to detail page: ${detailUrl}`);
  await conceptsPage.detailPage.goto(detailUrl);

  console.log('[TEST] Clicking edit concept...');
  await conceptsPage.detailPage.editConcept();

  console.log('[TEST] Checking accessibility on edit page...');
  await conceptsPage.editPage.checkAccessibility();

  console.log('[TEST] Filling and saving updated concept...');
  await conceptsPage.editPage.fillFormAndSave(updatedConcept, apiRequestContext, true);

  console.log(`[TEST] Navigating to detail page again: ${detailUrl}`);
  await conceptsPage.detailPage.goto(detailUrl);

  console.log('[TEST] Expecting details to match updated concept...');
  await conceptsPage.detailPage.expectDetails(updatedConcept, apiRequestContext);

  console.log('[TEST] Test completed: test if updating an existing concept saves correctly');
});
