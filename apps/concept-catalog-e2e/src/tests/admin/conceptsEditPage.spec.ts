import * as crypto from 'crypto';
import { Concept } from '@catalog-frontend/types';
import { expect } from '@playwright/test';
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
      id: '',
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
    fagområde: undefined,
    fagområdeKoder: undefined,
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
    assignedUser: undefined,
    begrepsRelasjon: [],
    interneFelt: undefined,
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
            acc[field.id] = { value: randomUser?.id ?? '' };
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

runTestAsAdmin(
  'test that it should not be possible to make a relation to itself',
  async ({ conceptsPage, playwright }) => {
    console.log('[TEST] Starting test: test that it should not be possible to make a relation to itself');

    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    console.log('[TEST] Created API request context with admin storage state');

    const concept: Concept = {
      id: null,
      anbefaltTerm: {
        navn: {
          nb: `Self relation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          nn: `Self relation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
          en: `Self relation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        },
      },
      ansvarligVirksomhet: {
        id: '',
      },
      definisjon: {
        tekst: {
          nb: 'This is a test concept for self-relation nb',
          nn: 'This is a test concept for self-relation nn',
          en: 'This is a test concept for self-relation en',
        },
        kildebeskrivelse: {
          forholdTilKilde: 'basertPaaKilde',
          kilde: [
            {
              tekst: 'Kilde concept for self-relation',
              uri: 'https://kilde.concept.self-relation.no',
            },
          ],
        },
      },
      kontaktpunkt: {
        harEpost: 'test-self-relation@example.com',
        harTelefon: '123456789',
      },
      versjonsnr: { major: 1, minor: 0, patch: 0 },
      merknad: {
        nb: 'Merknad test concept for self-relation nb',
        nn: 'Merknad test concept for self-relation nn',
        en: 'Merknad test concept for self-relation en',
      },
      merkelapp: ['merkelapp-self-relation'],
      eksempel: {
        nb: 'Eksempel test concept for self-relation nb',
        nn: 'Eksempel test concept for self-relation nn',
        en: 'Eksempel test concept for self-relation en',
      },
      fagområde: undefined,
      fagområdeKoder: undefined,
      omfang: {
        tekst: 'Omfang concept for self-relation',
        uri: 'https://omfang.concept.self-relation.no',
      },
      tillattTerm: {
        nb: ['tillat-term-self-relation nb'],
        nn: ['tillat-term-self-relation nn'],
        en: ['tillat-term-self-relation en'],
      },
      frarådetTerm: {
        nb: ['frarådet-term-self-relation nb'],
        nn: ['frarådet-term-self-relation nn'],
        en: ['frarådet-term-self-relation en'],
      },
      gyldigFom: '2199-01-01',
      gyldigTom: null,
      seOgså: [],
      internBegrepsRelasjon: [],
      internSeOgså: [],
      internErstattesAv: [],
      erstattesAv: [],
      statusURI: 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
      assignedUser: undefined,
      begrepsRelasjon: [],
      interneFelt: undefined,
      abbreviatedLabel: 'TCSELF',
    };

    console.log('[TEST] Creating test concept...');
    const id = await createConcept(apiRequestContext, concept);
    console.log(`[TEST] Concept created with id: ${id}`);

    const detailUrl = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`;
    console.log(`[TEST] Navigating to detail page: ${detailUrl}`);
    await conceptsPage.detailPage.goto(detailUrl);

    console.log('[TEST] Clicking edit concept...');
    await conceptsPage.detailPage.editConcept();

    console.log('[TEST] Adding a relation...');
    await conceptsPage.editPage.clickAddRelation();

    console.log('[TEST] Selecting internal relation type...');
    await conceptsPage.page.getByText('Virksomhetens eget begrep').click();

    console.log('[TEST] Opening the search combobox...');
    await conceptsPage.page.getByRole('group', { name: 'Relatert begrep' }).getByRole('combobox').click();
    await conceptsPage.page.waitForTimeout(100);

    console.log('[TEST] Searching for the concept itself...');
    await conceptsPage.page
      .getByRole('group', { name: 'Relatert begrep' })
      .getByLabel('Søk begrep')
      .fill(concept.anbefaltTerm?.navn.nb);
    await conceptsPage.page.waitForTimeout(100);

    console.log('[TEST] Verifying that the concept itself is not available in search results...');
    // The concept should not appear in the search results due to the filter
    const searchResults = conceptsPage.page.getByRole('listbox');
    await expect(searchResults).toBeVisible();

    // Check that the current concept's name is not in the search results
    // We need to get the actual concept name that was generated
    const conceptName = concept.anbefaltTerm?.navn.nb;
    const currentConceptOption = conceptsPage.page.getByRole('option', { name: conceptName });
    await expect(currentConceptOption).not.toBeVisible();

    console.log('[TEST] Test completed: test that it should not be possible to make a relation to itself');
  },
);

runTestAsAdmin('test that URL fields only accept HTTPS URLs', async ({ conceptsPage, playwright }) => {
  console.log('[TEST] Starting test: test that URL fields only accept HTTPS URLs');

  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });
  console.log('[TEST] Created API request context with admin storage state');

  const concept: Concept = {
    id: null,
    anbefaltTerm: {
      navn: {
        nb: `URL validation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        nn: `URL validation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
        en: `URL validation test concept ${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 8)}`,
      },
    },
    ansvarligVirksomhet: {
      id: '',
    },
    definisjon: {
      tekst: {
        nb: 'This is a test concept for URL validation nb',
        nn: 'This is a test concept for URL validation nn',
        en: 'This is a test concept for URL validation en',
      },
      kildebeskrivelse: {
        forholdTilKilde: 'basertPaaKilde',
        kilde: [
          {
            tekst: 'Kilde for URL validation test',
            uri: 'https://kilde.url-validation.no',
          },
        ],
      },
    },
    kontaktpunkt: {
      harEpost: 'test-url-validation@example.com',
      harTelefon: '123456789',
    },
    versjonsnr: { major: 1, minor: 0, patch: 0 },
    merknad: {
      nb: 'Merknad test concept for URL validation nb',
      nn: 'Merknad test concept for URL validation nn',
      en: 'Merknad test concept for URL validation en',
    },
    merkelapp: ['merkelapp-url-validation'],
    eksempel: {
      nb: 'Eksempel test concept for URL validation nb',
      nn: 'Eksempel test concept for URL validation nn',
      en: 'Eksempel test concept for URL validation en',
    },
    fagområde: undefined,
    fagområdeKoder: undefined,
    omfang: {
      tekst: 'Omfang for URL validation test',
      uri: 'https://omfang.url-validation.no',
    },
    tillattTerm: {
      nb: ['tillat-term-url-validation nb'],
      nn: ['tillat-term-url-validation nn'],
      en: ['tillat-term-url-validation en'],
    },
    frarådetTerm: {
      nb: ['frarådet-term-url-validation nb'],
      nn: ['frarådet-term-url-validation nn'],
      en: ['frarådet-term-url-validation en'],
    },
    gyldigFom: '2199-01-01',
    gyldigTom: null,
    seOgså: [],
    internBegrepsRelasjon: [],
    internSeOgså: [],
    internErstattesAv: [],
    erstattesAv: [],
    statusURI: 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
    assignedUser: undefined,
    begrepsRelasjon: [],
    interneFelt: undefined,
    abbreviatedLabel: 'TCURL',
  };

  console.log('[TEST] Creating test concept...');
  const id = await createConcept(apiRequestContext, concept);
  console.log(`[TEST] Concept created with id: ${id}`);

  const detailUrl = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/${id}`;
  console.log(`[TEST] Navigating to detail page: ${detailUrl}`);
  await conceptsPage.detailPage.goto(detailUrl);

  console.log('[TEST] Clicking edit concept...');
  await conceptsPage.detailPage.editConcept();

  // Definition source URI - HTTP should be rejected immediately in modal
  console.log('[TEST] Testing definition source URI with HTTP URL in modal...');
  await conceptsPage.page.getByRole('button', { name: 'Allmennheten' }).click();

  // Wait for the definition modal to appear
  await conceptsPage.page.waitForTimeout(500);

  await conceptsPage.editPage.fillLanguageField(
    { nb: 'Min definisjon nb' },
    'Definisjon Hjelp til utfylling',
    ['Bokmål'],
    false,
  );
  // Add a source
  await conceptsPage.page.getByRole('group', { name: 'Forhold til kilde' }).getByLabel('Basert på kilde').click();
  await conceptsPage.page.getByRole('button', { name: 'Legg til kilde' }).click();

  await conceptsPage.page.getByRole('textbox', { name: 'https://kilde.no' }).fill('http://invalid-source.com');
  await conceptsPage.page.getByRole('button', { name: 'Legg til definisjon' }).click();

  // Check for validation error in the source URI field - should appear immediately
  const uriError = conceptsPage.page.getByText('Ugyldig lenke. Vennligst sørg for at lenken starter med');
  await expect(uriError).toBeVisible();

  await conceptsPage.page.getByRole('textbox', { name: 'https://kilde.no' }).fill('https://valid-https-source.com');
  await conceptsPage.page.getByRole('button', { name: 'Legg til definisjon' }).click();

  await expect(uriError).not.toBeVisible();
  await expect(conceptsPage.page.getByRole('dialog')).not.toBeVisible();

  // Value range link (omfang.uri) - HTTP should be rejected on form submission
  console.log('[TEST] Testing value range link with HTTP URL...');
  await conceptsPage.page.getByLabel('Lenke til referanse').fill('http://invalid-url.com');

  // Try to save the form - this should trigger validation for main form fields
  console.log('[TEST] Attempting to save form with invalid HTTP URL...');
  await conceptsPage.editPage.clickSaveButton(false);

  // Check for validation error - it should appear after save attempt
  await expect(uriError).toBeVisible();

  // Clear the invalid value range URL and enter a valid one
  await conceptsPage.page.getByLabel('Lenke til referanse').fill('https://valid-url.com');
  await conceptsPage.page.getByLabel('Lenke til referanse').blur();

  // The error should disappear immediately for modal fields
  await expect(uriError).not.toBeVisible();

  // Try to save again - should work now with valid HTTPS URLs
  console.log('[TEST] Attempting to save form with valid HTTPS URLs...');
  await conceptsPage.editPage.clickSaveButton();

  console.log('[TEST] Test completed: test that URL fields only accept HTTPS URLs');
});
