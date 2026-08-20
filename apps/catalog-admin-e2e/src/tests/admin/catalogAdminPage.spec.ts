import type { Dialog } from "@playwright/test";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import { uniqueString } from "../../utils/helpers";

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

runTestAsAdmin(
  "should create, rename and delete a code list",
  async ({ page, catalogAdminPage }) => {
    // This app reports every result through window.alert/confirm, which
    // Playwright auto-dismisses, so accept and record them
    const dialogs: string[] = [];
    page.on("dialog", async (dialog: Dialog) => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });

    await catalogAdminPage.gotoCatalog("/concepts/code-lists");
    await catalogAdminPage.expectOnCatalogPath("/concepts/code-lists");

    const name = uniqueString("e2e_code_list");
    const renamed = `${name}_renamed`;

    // Create. Only the create editor renders "Avbryt", the existing ones
    // render "Slett", so it is scoped on that.
    await page.getByRole("button", { name: "Opprett kodeliste" }).click();
    const createEditor = page
      .locator("u-details")
      .filter({ has: page.getByRole("button", { name: "Avbryt" }) });
    await createEditor.getByLabel("Navn").fill(name);
    await createEditor.getByLabel("Beskrivelse").fill("Opprettet av e2e");
    await createEditor.getByRole("button", { name: "Lagre endringer" }).click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();

    // Rename
    const codeList = page
      .locator("u-details")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await codeList.locator("u-summary").click();
    await codeList.getByLabel("Navn").fill(renamed);
    await codeList.getByRole("button", { name: "Lagre endringer" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toBeVisible();

    // Delete
    const renamedCodeList = page.locator("u-details").filter({
      has: page.getByRole("heading", { name: renamed, exact: true }),
    });
    await renamedCodeList.getByRole("button", { name: "Slett" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toHaveCount(0);

    // Create and rename reported success, delete went through its confirm, and
    // nothing failed silently. Delete itself reports no result.
    expect(dialogs).toContain("Oppdatering vellykket!");
    expect(dialogs).toContain(
      "Er du sikker på at du ønsker å slette kodelisten?",
    );
    expect(dialogs).not.toContain("Oppdatering feilet.");
    expect(dialogs).not.toContain("Ingen endringer funnet.");
  },
);

runTestAsAdmin(
  "should create, rename and delete a username",
  async ({ page, catalogAdminPage }) => {
    const dialogs: string[] = [];
    page.on("dialog", async (dialog: Dialog) => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });

    await catalogAdminPage.gotoCatalog("/general/users");
    await catalogAdminPage.expectOnCatalogPath("/general/users");

    const name = uniqueString("e2e_user");
    const renamed = `${name}_renamed`;

    await page
      .getByRole("button", { name: "Legg til nytt brukernavn" })
      .click();
    const createEditor = page
      .locator("u-details")
      .filter({ has: page.getByRole("button", { name: "Avbryt" }) });
    await createEditor.getByLabel("Navn").fill(name);
    await createEditor.getByLabel("E-post").fill(`${name}@example.com`);
    await createEditor.getByRole("button", { name: "Lagre" }).click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();

    const user = page
      .locator("u-details")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await user.locator("u-summary").click();
    await user.getByLabel("Navn").fill(renamed);
    await user.getByRole("button", { name: "Lagre" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toBeVisible();

    const renamedUser = page.locator("u-details").filter({
      has: page.getByRole("heading", { name: renamed, exact: true }),
    });
    await renamedUser.getByRole("button", { name: "Slett" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toHaveCount(0);

    expect(dialogs).toContain("Oppdatering vellykket!");
    expect(dialogs).not.toContain("Oppdatering feilet.");
  },
);

runTestAsAdmin(
  "should create, rename and delete an internal field",
  async ({ page, catalogAdminPage }) => {
    const dialogs: string[] = [];
    page.on("dialog", async (dialog: Dialog) => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });

    await catalogAdminPage.gotoCatalog("/concepts/internal-fields");
    await catalogAdminPage.expectOnCatalogPath("/concepts/internal-fields");

    const name = uniqueString("e2e_field");
    const renamed = `${name}_renamed`;

    await page
      .getByRole("button", { name: "Opprett nytt internt felt" })
      .click();
    const createEditor = page
      .locator("u-details")
      .filter({ has: page.getByRole("button", { name: "Avbryt" }) });
    await createEditor.getByLabel("Navn på felt").fill(name);
    await createEditor.getByLabel("Type felt").selectOption("text_short");
    await createEditor.getByRole("button", { name: "Lagre" }).click();
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();

    const field = page
      .locator("u-details")
      .filter({ has: page.getByRole("heading", { name, exact: true }) });
    await field.locator("u-summary").click();
    await field.getByLabel("Navn på felt").fill(renamed);
    await field.getByRole("button", { name: "Lagre" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toBeVisible();

    const renamedField = page.locator("u-details").filter({
      has: page.getByRole("heading", { name: renamed, exact: true }),
    });
    await renamedField.getByRole("button", { name: "Slett" }).click();
    await expect(
      page.getByRole("heading", { name: renamed, exact: true }),
    ).toHaveCount(0);

    expect(dialogs).toContain("Oppdatering vellykket!");
    expect(dialogs).not.toContain("Oppdatering feilet.");
  },
);
