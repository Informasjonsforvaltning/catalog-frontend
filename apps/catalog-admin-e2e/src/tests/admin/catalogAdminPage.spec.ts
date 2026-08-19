import { expect, runTestAsAdmin } from "../../fixtures/basePage";

runTestAsAdmin(
  "the home page lists the organizations the user administers",
  async ({ page, catalogAdminPage }) => {
    await catalogAdminPage.gotoHome();

    await expect(page).toHaveURL("/");
    await catalogAdminPage.expectCardLink("");
  },
);

runTestAsAdmin(
  "the catalog admin landing page renders",
  async ({ catalogAdminPage }) => {
    await catalogAdminPage.gotoCatalog();
    await catalogAdminPage.expectOnCatalogPath();

    await catalogAdminPage.expectHeading("Administrere katalog");
    await catalogAdminPage.expectCardLink("/general");
    await catalogAdminPage.expectCardLink("/concepts");
  },
);

runTestAsAdmin(
  "the concept settings page links to its three sections",
  async ({ catalogAdminPage }) => {
    await catalogAdminPage.gotoCatalog("/concepts");
    await catalogAdminPage.expectOnCatalogPath("/concepts");

    await catalogAdminPage.expectHeading("Administrere begrepskatalog");
    await catalogAdminPage.expectCardLink("/concepts/code-lists");
    await catalogAdminPage.expectCardLink("/concepts/internal-fields");
    await catalogAdminPage.expectCardLink("/concepts/editable-fields");
  },
);

runTestAsAdmin(
  "the code lists page renders",
  async ({ page, catalogAdminPage }) => {
    await catalogAdminPage.gotoCatalog("/concepts/code-lists");
    await catalogAdminPage.expectOnCatalogPath("/concepts/code-lists");

    await catalogAdminPage.expectHeading("Administrere begrepskatalog");
    await catalogAdminPage.expectSectionHeading("Kodelister");
    await expect(
      page.getByRole("button", { name: "Opprett kodeliste" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Søk etter kodeliste...")).toBeVisible();
  },
);

runTestAsAdmin(
  "the editable fields page renders its code list selector",
  async ({ page, catalogAdminPage }) => {
    await catalogAdminPage.gotoCatalog("/concepts/editable-fields");
    await catalogAdminPage.expectOnCatalogPath("/concepts/editable-fields");

    await catalogAdminPage.expectHeading("Administrere begrepskatalog");
    await catalogAdminPage.expectSectionHeading("Editerbare felt");
    await expect(page.getByLabel("Velg kodeliste")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lagre" })).toBeVisible();
  },
);

runTestAsAdmin(
  "the usernames page renders",
  async ({ page, catalogAdminPage }) => {
    await catalogAdminPage.gotoCatalog("/general/users");
    await catalogAdminPage.expectOnCatalogPath("/general/users");

    await catalogAdminPage.expectHeading("Administrere katalog");
    await catalogAdminPage.expectSectionHeading("Brukernavn");
    await expect(
      page.getByRole("button", { name: "Legg til nytt brukernavn" }),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Søk etter brukernavn..."),
    ).toBeVisible();
  },
);
