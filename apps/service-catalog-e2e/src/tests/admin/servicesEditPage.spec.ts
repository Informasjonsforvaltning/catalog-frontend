import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import ServicesEditPage from "../../page-object-model/servicesEditPage";
import ServiceDetailPage from "../../page-object-model/serviceDetailPage";
import {
  adminAuthFile,
  createService,
  deleteService,
  uniqueString,
} from "../../utils/helpers";
import { getRandomService } from "../../utils/service";

const catalogId = () => process.env.E2E_CATALOG_ID as string;

runTestAsAdmin(
  "should create new service from the registration form",
  async ({ page, context, accessibilityBuilder }) => {
    const editPage = new ServicesEditPage(page, context, accessibilityBuilder);
    const title = uniqueString("new_service_nb");

    await page.goto(`/catalogs/${catalogId()}/services`);
    await page.getByRole("link", { name: "Opprett ny tjeneste" }).click();
    await page.waitForURL(`/catalogs/${catalogId()}/services/new`);

    // No language input is rendered on /new until a language is opened.
    await editPage.fillTitle({ nb: title }, ["Bokmål"]);

    // "Ignorer påkrevde felt" is on by default, so a title is enough to save
    await expect(editPage.saveButton).toBeEnabled();
    await editPage.clickSave();

    await page.waitForURL(
      new RegExp(`/catalogs/${catalogId()}/services/.+/edit`),
    );
    await editPage.expectFormReady();
    await expect(editPage.titleGroup.getByLabel("Bokmål")).toHaveValue(title);
  },
);

runTestAsAdmin(
  "should edit service about section",
  async ({ page, context, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const service = await createService(
      apiRequestContext,
      getRandomService("about"),
    );

    const editPage = new ServicesEditPage(page, context, accessibilityBuilder);
    const detailPage = new ServiceDetailPage(
      page,
      context,
      accessibilityBuilder,
    );

    await detailPage.goto(catalogId(), service as string);
    await detailPage.clickEdit();
    await editPage.expectFormReady();

    const newTitle = { nb: uniqueString("new_title_nb") };
    const newDescription = { nb: uniqueString("new_description_nb") };
    const newHomepage = `https://${uniqueString("new_homepage")}.example.com`;

    await editPage.fillTitle(newTitle);
    await editPage.fillDescription(newDescription);
    await editPage.fillHomepage(newHomepage);

    await editPage.clickSave();
    await editPage.expectSaveSuccessful();

    await detailPage.goto(catalogId(), service as string);
    await detailPage.expectHeading(newTitle.nb);
    await detailPage.expectText(newDescription.nb);
    await detailPage.expectText(newHomepage);

    await deleteService(apiRequestContext, service as string);
  },
);

runTestAsAdmin(
  "should edit service contact point section",
  async ({ page, context, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const service = await createService(
      apiRequestContext,
      getRandomService("contact"),
    );

    const editPage = new ServicesEditPage(page, context, accessibilityBuilder);
    const detailPage = new ServiceDetailPage(
      page,
      context,
      accessibilityBuilder,
    );

    await detailPage.goto(catalogId(), service as string);
    await detailPage.clickEdit();
    await editPage.expectFormReady();

    const newCategory = { nb: uniqueString("new_category_nb") };
    const newEmail = `${uniqueString("new_contact")}@example.com`;

    await editPage.fillContactCategory(newCategory);
    await editPage.fillContactEmail(newEmail);

    await editPage.clickSave();
    await editPage.expectSaveSuccessful();

    await detailPage.goto(catalogId(), service as string);
    await detailPage.expectText(newCategory.nb);
    await detailPage.expectText(newEmail);

    await deleteService(apiRequestContext, service as string);
  },
);

runTestAsAdmin(
  "empty submit check prevents save when only whitespace added",
  async ({ page, context, playwright, accessibilityBuilder }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const title = "Test whitespace";
    const service = await createService(apiRequestContext, {
      ...getRandomService("whitespace"),
      title: { nb: title, nn: "", en: "" },
    });

    const editPage = new ServicesEditPage(page, context, accessibilityBuilder);
    await editPage.goto(catalogId(), service as string);
    await editPage.expectFormReady();

    const titleField = editPage.titleGroup.getByLabel("Bokmål");
    await titleField.fill(`${title} `);

    // Fail if the input event never reached the form.
    await expect(editPage.saveButton).toBeEnabled();

    await editPage.clickSave();
    await page.waitForLoadState("networkidle");

    await expect(editPage.successSnackbar).not.toBeVisible();
    await expect(editPage.errorSnackbar).not.toBeVisible();

    // The whitespace was normalized away and the form is pristine again
    await expect(titleField).toHaveValue(title);
    await expect(editPage.saveButton).toBeDisabled();

    // Nothing was blocked by validation instead
    await expect(
      page.getByText("Skjemaet inneholder feil. Sjekk feltene i rødt."),
    ).toHaveCount(0);

    // Re-add the whitespace and submit without blurring the input, value is trimmed on blur.
    await titleField.fill(`${title} `);
    await expect(editPage.saveButton).toBeEnabled();
    await editPage.saveButton.dispatchEvent("click");
    await page.waitForLoadState("networkidle");

    await expect(editPage.successSnackbar).not.toBeVisible();
    await expect(editPage.errorSnackbar).not.toBeVisible();
    await expect(titleField).toHaveValue(title);

    await deleteService(apiRequestContext, service as string);
  },
);
