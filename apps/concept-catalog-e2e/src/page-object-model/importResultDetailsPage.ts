import {
  APIRequestContext,
  BrowserContext,
  expect,
  Page,
} from "@playwright/test";
import type AxeBuilder from "@axe-core/playwright";
import ImportResultsPage from "./importResultsPage";
import { deleteAllImportResults } from "../utils/helpers";
import { localization } from "@catalog-frontend/utils";

export default class ImportResultDetailsPage {
  url: string;
  page: Page;
  importResultsPage: ImportResultsPage;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(
    page: Page,
    context: BrowserContext,
    accessibilityBuilder: AxeBuilder,
  ) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`;
    this.page = page;
    this.importResultsPage = new ImportResultsPage(
      page,
      context,
      accessibilityBuilder,
    );
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  public getButtonByName = (name: string) =>
    this.page.getByRole("button", { name: name });
  public getElementByText = (text: string) => this.page.getByText(text);

  public getCancelImportButton = () =>
    this.getButtonByName(`${localization.importResult.cancelImport}`);
  public getDeleteImportButton = () =>
    this.getButtonByName(`${localization.importResult.deleteImport}`);
  public getConfirmButton = () =>
    this.getButtonByName(`${localization.importResult.confirmImport}`);

  public getOngoingLabel = () =>
    this.getElementByText(`${localization.importResult.inProgress}`);
  public getSuccessfulLabel = () =>
    this.getElementByText(`${localization.importResult.completed}`);
  public getCancelledLabel = () =>
    this.getElementByText(`${localization.importResult.cancelled}`);
  public getWaitingForConfirmationLabel = () =>
    this.getElementByText(`${localization.importResult.pendingConfirmation}`);
  public getFailedLabel = () =>
    this.getElementByText(`${localization.importResult.failed}`);

  async goto(importResultId: string) {
    await this.page.goto(`${this.url}/${importResultId}`);
  }

  async checkVisibleButtons() {
    await expect(this.getCancelImportButton()).toBeVisible({ timeout: 5000 });
    await expect(this.getDeleteImportButton()).toBeVisible({ timeout: 5000 });
    await expect(this.getConfirmButton()).toBeVisible({ timeout: 5000 });
  }

  async checkDisabledDeleteButton() {
    await expect(this.getDeleteImportButton()).toBeDisabled({ timeout: 5000 });
  }

  async checkSuccessfulStatus() {
    await expect(this.getSuccessfulLabel().first()).toBeVisible({
      timeout: 20000,
    });
  }

  async checkCancelledStatus() {
    await expect(this.getCancelledLabel().first()).toBeVisible({
      timeout: 20000,
    });
  }

  async checkWaitingForConfirmationStatus() {
    await expect(this.getWaitingForConfirmationLabel().first()).toBeVisible({
      timeout: 30000,
    });
  }

  async checkFailedStatus() {
    await expect(this.getFailedLabel().first()).toBeVisible({ timeout: 30000 });
  }

  async confirmImport() {
    await this.getConfirmButton().click({ timeout: 40000 });
  }

  async cancelImport() {
    await this.getCancelImportButton().click({ timeout: 40000 });
  }

  async deleteAllImportResults(apiRequestContext: APIRequestContext) {
    await deleteAllImportResults(apiRequestContext);
  }
}
