import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createPublicService,
  deletePublicService,
  uniqueString,
} from "../../utils/helpers";
import { getRandomService } from "../../utils/service";
import { ServiceToBeCreated } from "@catalog-frontend/types";
import type { Dialog } from "@playwright/test";

const catalogId = () => process.env.E2E_CATALOG_ID as string;

runTestAsAdmin(
  "the public services page renders",
  async ({ publicServicesPage }) => {
    await publicServicesPage.goto();

    await expect(
      publicServicesPage.page.getByRole("heading", {
        level: 1,
        name: "Tjenestekatalog - offentlige tjenester",
      }),
    ).toBeVisible();
    await expect(publicServicesPage.searchInput()).toBeVisible();
    await expect(publicServicesPage.createLink()).toHaveAttribute(
      "href",
      `/catalogs/${catalogId()}/public-services/new`,
    );
    await publicServicesPage.checkAccessibility();
  },
);

runTestAsAdmin(
  "should find a public service by title",
  async ({ publicServicesPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const service = getRandomService("public") as ServiceToBeCreated;
    const id = await createPublicService(apiRequestContext, service);

    try {
      await publicServicesPage.goto();
      await publicServicesPage.search(service.title.nb as string);

      await expect(
        publicServicesPage.page.getByRole("link", {
          name: service.title.nb as string,
        }),
      ).toBeVisible();
    } finally {
      await deletePublicService(apiRequestContext, id as string);
    }
  },
);

runTestAsAdmin(
  "should create a new public service from the registration form",
  async ({ page, publicServicesPage }) => {
    const title = uniqueString("new_public_service_nb");

    await publicServicesPage.goto();
    await publicServicesPage.createLink().click();
    await page.waitForURL(`/catalogs/${catalogId()}/public-services/new`);

    // Hovedformål only exists for public services
    await expect(
      page.getByRole("group", {
        name: "Hovedformål Hjelp til utfylling Anbefalt",
      }),
    ).toBeVisible();

    const titleGroup = page.getByRole("group", {
      name: "Tittel Hjelp til utfylling Må fylles ut",
    });
    await titleGroup
      .getByRole("button", { name: "Bokmål", exact: true })
      .click();
    await titleGroup.getByLabel("Bokmål").fill(title);

    await page.getByRole("button", { name: "Lagre", exact: true }).click();

    await page.waitForURL(
      new RegExp(`/catalogs/${catalogId()}/public-services/.+/edit`),
    );
    await expect(titleGroup.getByLabel("Bokmål")).toHaveValue(title);
  },
);

runTestAsAdmin(
  "should publish and unpublish a public service",
  async ({ page, publicServicesPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const service = getRandomService("publish") as ServiceToBeCreated;
    const id = await createPublicService(apiRequestContext, service);

    // Both actions go through window.confirm, which Playwright auto dismisses
    const dialogs: string[] = [];
    page.on("dialog", async (dialog: Dialog) => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });

    try {
      await publicServicesPage.gotoDetail(id as string);

      await expect(
        page.getByText("Ikke publisert", { exact: true }),
      ).toBeVisible();
      await expect(publicServicesPage.deleteButton()).toBeEnabled();

      await publicServicesPage.publishSwitch().click();
      await expect(page.getByText("Publisert på Data.Norge.no")).toBeVisible();
      await expect(publicServicesPage.publishSwitch()).toBeChecked();

      // Delete is blocked while published
      await expect(publicServicesPage.deleteButton()).toBeDisabled();

      await publicServicesPage.publishSwitch().click();
      await expect(
        page.getByText("Ikke publisert", { exact: true }),
      ).toBeVisible();

      expect(dialogs).toContain(
        "Er du sikker på at du vil publisere tjenesten?",
      );
      expect(dialogs).toContain(
        "Er du sikker på at du vil avpublisere tjenesten?",
      );
    } finally {
      await deletePublicService(apiRequestContext, id as string);
    }
  },
);

runTestAsAdmin(
  "should delete a public service from the detail page",
  async ({ page, publicServicesPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const service = getRandomService("delete") as ServiceToBeCreated;
    const id = await createPublicService(apiRequestContext, service);

    const dialogs: string[] = [];
    page.on("dialog", async (dialog: Dialog) => {
      dialogs.push(dialog.message());
      await dialog.accept();
    });

    await publicServicesPage.gotoDetail(id as string);
    await publicServicesPage.deleteButton().click();

    // Deleting returns to the list
    await page.waitForURL(`/catalogs/${catalogId()}/public-services`);
    expect(dialogs).toContain("Er du sikker på at du vil slette tjenesten?");

    await publicServicesPage.search(service.title.nb as string);
    await expect(
      page.getByRole("link", { name: service.title.nb as string }),
    ).toHaveCount(0);
  },
);
