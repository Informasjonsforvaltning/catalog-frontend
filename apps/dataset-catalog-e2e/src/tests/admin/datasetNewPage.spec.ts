import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import DatasetEditPage from "../../page-object-model/datasetEditPage";
import { uniqueString } from "../../utils/helpers";

const newDatasetUrl = () =>
  `/catalogs/${process.env.E2E_CATALOG_ID}/datasets/new`;

runTestAsAdmin(
  "should create new dataset from the registration form",
  async ({ page, datasetsPage }) => {
    const editPage: DatasetEditPage = datasetsPage.editPage;
    const title = uniqueString("new_dataset_nb");

    // "Legg til datasett" opens a dialog where the standard is picked
    await datasetsPage.goto(process.env.E2E_CATALOG_ID as string);
    await datasetsPage.clickCreateDataset();
    await page.getByRole("link", { name: "Velg DCAT-AP-NO" }).click();
    await page.waitForURL(newDatasetUrl());

    // On /new no language input is rendered yet, so Bokmål has to be opened
    // first. This is the main difference from the edit page, which arrives with
    // all languages already present.
    await editPage.fillTitleField({ nb: title }, ["Bokmål"], false);

    // "Ignorer påkrevde felt" is on by default, so a title is enough to save
    await editPage.clickSaveButton(false);

    // A successful create redirects to the edit page of the new dataset
    await page.waitForURL(
      new RegExp(`/catalogs/${process.env.E2E_CATALOG_ID}/datasets/.+/edit`),
    );
  },
);

runTestAsAdmin(
  "should show validation error when title is too short",
  async ({ page, datasetsPage }) => {
    const editPage: DatasetEditPage = datasetsPage.editPage;

    await page.goto(newDatasetUrl());

    // Two characters, one below the minimum of three
    await editPage.fillTitleField({ nb: "ab" }, ["Bokmål"], false);
    await editPage.clickSaveButton(false);

    await expect(
      page.getByText("Tittelen må være minst 3 karakterer lang."),
    ).toBeVisible();

    // Still on the registration form, nothing was created
    await expect(page).toHaveURL(newDatasetUrl());
  },
);

runTestAsAdmin(
  "should show validation errors for required fields when they are not ignored",
  async ({ page, datasetsPage }) => {
    const editPage: DatasetEditPage = datasetsPage.editPage;

    await page.goto(newDatasetUrl());

    await editPage.fillTitleField(
      { nb: uniqueString("title_nb") },
      ["Bokmål"],
      false,
    );
    // Four characters, one below the minimum of five
    await editPage.fillDescriptionField({ nb: "abcd" }, ["Bokmål"], false);

    // Switch from the draft schema to the full one
    await editPage.setIgnoreRequired(false);

    await editPage.clickSaveButton(false);

    await expect(
      page.getByText("Beskrivelsen må være minst 5 karakterer lang."),
    ).toBeVisible();
    await expect(
      page.getByText("Minst ett EU-tema må være valgt."),
    ).toBeVisible();

    await expect(page).toHaveURL(newDatasetUrl());
  },
);

runTestAsAdmin(
  "should add distribution with only the required access link",
  async ({ page, datasetsPage }) => {
    const editPage: DatasetEditPage = datasetsPage.editPage;

    // #1441: the form crashed when a distribution was submitted with the
    // collapsed fields expanded but left empty, so collect client side errors
    const pageErrors: string[] = [];
    page.on("pageerror", (error: Error) => pageErrors.push(error.message));

    await page.goto(newDatasetUrl());
    await editPage.fillTitleField(
      { nb: uniqueString("distribution_dataset_nb") },
      ["Bokmål"],
      false,
    );

    await editPage.clickAddDistribution();
    const dialog = editPage.distributionDialog();
    await expect(dialog).toBeVisible();

    const accessUrl = "https://example.com/minimal-distribution";
    await editPage.fillDistributionAccessUrl(accessUrl);

    // Expand the two code list fields without selecting anything. This is the
    // exact trigger for #1441: expanding used to put an empty value into the
    // array, which was then submitted.
    await editPage.expandDistributionField("Legg til medietyper");
    await editPage.expandDistributionField("Legg til tilgangstjeneste");

    // Title, description, format and licence are deliberately left untouched
    await editPage.submitDistributionModal();

    // The modal closes instead of the form crashing
    await expect(dialog).toBeHidden();
    expect(pageErrors).toEqual([]);

    // The distribution is accepted by the backend as well
    await editPage.clickSaveButton(false);
    await page.waitForURL(
      new RegExp(`/catalogs/${process.env.E2E_CATALOG_ID}/datasets/.+/edit`),
    );
    expect(pageErrors).toEqual([]);
  },
);
