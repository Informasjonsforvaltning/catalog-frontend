import { DatasetToBeCreated } from '@catalog-frontend/types';
import { expect, runTestAsAdmin } from '../../fixtures/basePage';
import { adminAuthFile, createDataset, uniqueString } from '../../utils/helpers';
import { accessRightPublic } from '@catalog-frontend/utils';
import EditPage from '../../page-object-model/datasetEditPage';
import DatasetDetailPage from '../../page-object-model/datasetDetailPage';
import DatasetEditPage from '../../page-object-model/datasetEditPage';

const createRandomDataset = async (playwright) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  // Create a random dataset
  const dataset: DatasetToBeCreated = {
    title: {
      nb: uniqueString('title_nb'),
      nn: uniqueString('title_nn'),
      en: uniqueString('title_en'),
    },
    description: {
      nb: uniqueString('description_nb'),
      nn: uniqueString('description_nn'),
      en: uniqueString('description_en'),
    },
    accessRight: accessRightPublic.uri,
    legalBasisForRestriction: [
      {
        uri: 'https://lovdata.no/dokument/NL/lov/2018-06-15-25',
        prefLabel: {
          nb: 'Personvernloven § 8',
          nn: 'Personvernloven § 8',
          en: 'Personvernloven § 8',
        },
      },
    ],
    legalBasisForProcessing: [
      {
        uri: 'https://lovdata.no/dokument/NL/lov/2018-06-15-25',
        prefLabel: {
          nb: 'Personvernloven § 8',
          nn: 'Personvernloven § 8',
          en: 'Personvernloven § 8',
        },
      },
    ],
    legalBasisForAccess: [
      {
        uri: 'https://lovdata.no/dokument/NL/lov/2018-06-15-25',
        prefLabel: {
          nb: 'Personvernloven § 8',
          nn: 'Personvernloven § 8',
          en: 'Personvernloven § 8',
        },
      },
    ],
    approved: false,
    contactPoints: [
      {
        email: 'test@example.com',
        phone: '+47 12 34 56 78',
        url: 'https://example.com/contact',
      },
    ],
    distribution: [
      {
        title: {
          nb: uniqueString('title_dist_nb'),
          nn: uniqueString('title_dist_nn'),
          en: uniqueString('title_dist_en'),
        },
        description: {
          nb: uniqueString('description_dist_nb'),
          nn: uniqueString('description_dist_nn'),
          en: uniqueString('description_dist_en'),
        },
        accessURL: ['https://example.com/data'],
        license: 'http://publications.europa.eu/resource/authority/licence/NLOD_2_0',
      },
    ],
    landingPage: ['https://example.com/dataset'],
    references: [],
    spatial: [],
    temporal: [],
  };

  const datasetId = await createDataset(apiRequestContext, dataset);
  return { id: datasetId, ...dataset };
};

runTestAsAdmin('should allow editing dataset about section', async ({ page, datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const newTitle = {
    nb: uniqueString('new_title_nb'),
    nn: uniqueString('new_title_nn'),
    en: uniqueString('new_title_en'),
  };
  const newDescription = {
    nb: uniqueString('new_description_nb'),
    nn: uniqueString('new_description_nn'),
    en: uniqueString('new_description_en'),
  };

  // Navigate to dataset details and click edit
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  // Initialize edit page
  const editPage: EditPage = datasetsPage.editPage;
  await editPage.expectEditPageUrl(process.env.E2E_CATALOG_ID, dataset.id);

  // Verify initial title and description
  await editPage.expectTitleField('Bokmål', dataset.title.nb as string);
  await editPage.expectDescriptionField('Bokmål', dataset.description.nb as string);

  // Change title and description
  await editPage.fillTitleField(newTitle, [], false);
  await editPage.fillDescriptionField(newDescription, [], false);

  // Fill in required fields
  await editPage.selectAccessRights('public');

  await editPage.clickAddLegalRestriction();
  await editPage.fillUrlWithLabelModal(
    'Leg til skjermingshjemmel',
    {
      uri: 'https://lovdata.no/dokument/NL/lov/1',
      prefLabel: { nb: 'Personvernloven § 1', nn: 'Personvernloven § 1', en: 'Personvernloven § 1' },
    },
    ['Bokmål', 'Nynorsk', 'Engelsk'],
    false,
  );

  await editPage.clickAddLegalProcessing();
  await editPage.fillUrlWithLabelModal(
    'Legg til behandlingsgrunnlag',
    {
      uri: 'https://lovdata.no/dokument/NL/lov/2',
      prefLabel: { nb: 'Personvernloven § 2', nn: 'Personvernloven § 2', en: 'Personvernloven § 2' },
    },
    ['Bokmål', 'Nynorsk', 'Engelsk'],
    false,
  );

  await editPage.clickAddLegalAccess();
  await editPage.fillUrlWithLabelModal(
    'Legg til utleveringshjemmel',
    {
      uri: 'https://lovdata.no/dokument/NL/lov/3',
      prefLabel: { nb: 'Personvernloven § 3', nn: 'Personvernloven § 3', en: 'Personvernloven § 3' },
    },
    ['Bokmål', 'Nynorsk', 'Engelsk'],
    false,
  );

  await editPage.setPublicationDate(new Date().toISOString());

  // Save changes
  await editPage.clickSaveButton();

  // Verify we're back on the details page
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await expect(page).toHaveURL(`/catalogs/${process.env.E2E_CATALOG_ID}/datasets/${dataset.id}`);

  // Verify the changes were saved
  await detailPage.expectTitle(newTitle.nb);
  await detailPage.expectDescription(newDescription.nb);
  await detailPage.expectAccessRights('Allmenn tilgang');
  await detailPage.expectLegalRestriction('Personvernloven § 1');
  await detailPage.expectLegalProcessing('Personvernloven § 2');
  await detailPage.expectLegalAccess('Personvernloven § 3');
  await detailPage.expectPublicationDate(new Date().toISOString().split('T')[0]);
});

runTestAsAdmin('should edit dataset theme section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  // Select EU data theme
  await editPage.selectEuDataTheme('Energi');

  // Select LOS theme
  await editPage.selectLosTheme('Energibruk');

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectEuDataTheme('Energi');
  await detailPage.expectLosTheme('Energibruk');
});

runTestAsAdmin('should edit dataset distribution section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  const distributionTitle = {
    nb: uniqueString('distribution_title_nb'),
    nn: uniqueString('distribution_title_nn'),
    en: uniqueString('distribution_title_en'),
  };
  const distributionDescription = {
    nb: uniqueString('distribution_description_nb'),
    nn: uniqueString('distribution_description_nn'),
    en: uniqueString('distribution_description_en'),
  };
  // Add distribution
  await editPage.clickAddDistribution();
  await editPage.fillDistributionForm({
    title: distributionTitle,
    description: distributionDescription,
    accessUrl: 'https://example.com/access-url',
    license: 'Norsk lisens for offentlige data',
    format: 'CSV',
  });

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectDistributionTitle(distributionTitle.nb as string);
  await detailPage.expectDistributionDescription(distributionDescription.nb as string);
  await detailPage.expectDistributionAccessUrl('https://example.com/access-url');
  await detailPage.expectDistributionLicense('Norsk lisens for offentlige data');
  await detailPage.expectDistributionFormat('CSV');
});

runTestAsAdmin('should edit dataset details section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  // Fill in details
  await editPage.addLandingPage('https://example.com/landing-page', false);
  await editPage.checkLanguage('Bokmål');
  await editPage.checkLanguage('Nynorsk');
  await editPage.checkLanguage('Engelsk');
  await editPage.selectCoverageArea('Norge');
  await editPage.addPeriod('2020-01-01', '2020-12-01');

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectLandingPage('https://example.com/landing-page');
  await detailPage.expectLanguages(['Norsk Bokmål', 'Norsk Nynorsk', 'Engelsk']);
  await detailPage.expectCoverageArea('Norge');
  await detailPage.expectPeriod('01.01.2020', '01.12.2020');
});

runTestAsAdmin('should edit dataset relations section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  const referenceTitle = {
    nb: uniqueString('reference_title_nb'),
    nn: uniqueString('reference_title_nn'),
    en: uniqueString('reference_title_en'),
  };

  // Add reference
  await editPage.clickAddRelation();
  await editPage.fillRelationForm({
    relationType: 'Er en del av',
    dataset: 'Entur Timetable data',
  });

  await editPage.clickAddRelatedResource();
  await editPage.fillRelatedResourceForm({
    prefLabel: referenceTitle,
    uri: 'https://example.com/related-reference',
  });

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectRelatedResourceTitle(referenceTitle.nb as string);
  await detailPage.expectRelatedResourceUri('https://example.com/related-reference');
  await detailPage.expectRelationTitle('Entur Timetable data');
  await detailPage.expectRelationType('Er en del av');
});

runTestAsAdmin('should edit dataset concept section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  const keywords = {
    nb: [uniqueString('keywords_nb'), uniqueString('keywords_nb')],
    nn: [uniqueString('keywords_nn'), uniqueString('keywords_nn')],
    en: [uniqueString('keywords_en'), uniqueString('keywords_en')],
  };

  // Add concept
  await editPage.selectConcept('barnetillegg');
  await editPage.selectConcept('basispensjon');
  await editPage.fillKeywords(keywords);

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectConceptTitle('barnetillegg');
  await detailPage.expectConceptTitle('basispensjon');
  await detailPage.expectKeywords(keywords.nb);
});

runTestAsAdmin('should edit dataset information model section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  const modelTitle = {
    nb: uniqueString('model_title_nb'),
    nn: uniqueString('model_title_nn'),
    en: uniqueString('model_title_en'),
  };

  // Add information model
  await editPage.selectInformationModel('ssbs informasjonsmodell');
  await editPage.clickAddInformationModel();
  await editPage.addInformationModelSource({
    prefLabel: modelTitle,
    uri: 'https://example.com/information-model',
    open: ['Bokmål', 'Nynorsk', 'Engelsk'],
    clear: false,
  });

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectInformationModelTitle('ssbs informasjonsmodell');
  await detailPage.expectInformationModelTitle(modelTitle.nb as string);
  await detailPage.expectInformationModelUri('https://example.com/information-model');
});

runTestAsAdmin('should edit dataset contact point section', async ({ datasetsPage, playwright }) => {
  const dataset = await createRandomDataset(playwright);
  const detailPage: DatasetDetailPage = datasetsPage.detailPage;
  const editPage: DatasetEditPage = datasetsPage.editPage;

  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.clickEditButton();

  const newEmail = `${uniqueString('new_email')}@example.com`;

  // Add contact point
  await editPage.fillContactPointForm({
    email: newEmail,
    phone: '+358 12 34 56 78',
    url: 'https://example.com/new-contact',
  });

  // Save changes
  await editPage.clickSaveButton();

  // Verify changes
  await detailPage.goto(process.env.E2E_CATALOG_ID, dataset.id);
  await detailPage.expectContactPointEmail(newEmail);
  await detailPage.expectContactPointPhone('+358 12 34 56 78');
  await detailPage.expectContactPointUrl('https://example.com/new-contact');
});
