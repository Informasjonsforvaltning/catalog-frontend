import { expect, runTestAsAdmin } from "../../fixtures/basePage";

const catalogId = () => process.env.E2E_CATALOG_ID;

runTestAsAdmin(
  "the root url redirects to the catalog of the only organization",
  async ({ page }) => {
    await page.goto("/");

    // Two redirects: / -> /catalogs -> /catalogs/{id} for a single org user
    await expect(page).toHaveURL(new RegExp(`/catalogs/${catalogId()}$`));
  },
);

runTestAsAdmin(
  "the catalog cards show how many descriptions each catalog has",
  async ({ catalogPortalPage }) => {
    await catalogPortalPage.goto();

    await catalogPortalPage.expectResolvedCount(
      "datasetCatalog",
      "datasettbeskrivelser",
    );
    await catalogPortalPage.expectResolvedCount(
      "dataServiceCatalog",
      "API-beskrivelser",
    );
    await catalogPortalPage.expectResolvedCount(
      "conceptCatalog",
      "begrepsbeskrivelser",
    );
    await catalogPortalPage.expectResolvedCount(
      "serviceCatalog",
      "tjenestebeskrivelser",
    );
    await catalogPortalPage.expectResolvedCount(
      "publicServiceCatalog",
      "tjenestebeskrivelser",
    );
  },
);

runTestAsAdmin(
  "the catalog overview has no accessibility violations",
  async ({ catalogPortalPage }) => {
    await catalogPortalPage.goto();
    await catalogPortalPage.expectResolvedCount(
      "datasetCatalog",
      "datasettbeskrivelser",
    );

    await catalogPortalPage.checkAccessibility();
  },
);

runTestAsAdmin("the no access page renders", async ({ page }) => {
  await page.goto("/no-access");

  await expect(
    page.getByRole("heading", { level: 1, name: "Katalogoversikt" }),
  ).toBeVisible();
  await expect(page.getByText("Ingen tilgang")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Det ser ikke ut til at du har tilgang til noen kataloger\./,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Se dokumentasjon for hvordan du kan få tilgang.",
    }),
  ).toHaveAttribute("href", /\/docs\/sharing-data\/login-and-access$/);
});

runTestAsAdmin(
  "an invalid organization number redirects to no access",
  async ({ page }) => {
    await page.goto("/terms-and-conditions/123");

    await expect(page).toHaveURL(/\/no-access$/);
  },
);

runTestAsAdmin("the terms of use page renders", async ({ page }) => {
  await page.goto(`/terms-and-conditions/${catalogId()}`);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Bruksvilkår for registrering i Felles datakatalog",
    }),
  ).toBeVisible();

  // Read only: accepting is a POST with no revoke endpoint, keyed on the
  // organization, so it would permanently change the shared e2e catalog. The
  // terms may or may not already be accepted, so allow either state.
  const accepted = page.getByText(
    "aksepterte bruksvilkår på vegne av din virksomhet",
  );
  const checkbox = page.getByRole("checkbox", {
    name: /^Som bemyndiget person aksepterer jeg bruksvilkår/,
  });
  await expect(accepted.or(checkbox).first()).toBeVisible();
});
