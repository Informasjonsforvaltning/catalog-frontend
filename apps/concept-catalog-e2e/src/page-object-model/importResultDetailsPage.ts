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
    await this.page.goto(`${this.url}/${importResultId}`, {
      waitUntil: "networkidle",
    });
  }

  async checkVisibleButtons() {
    await expect(this.getCancelImportButton()).toBeVisible();
    await expect(this.getDeleteImportButton()).toBeVisible();
    await expect(this.getConfirmButton()).toBeVisible();
  }

  async checkDisabledDeleteButton() {
    await expect(this.getDeleteImportButton()).toBeDisabled();
  }

  async checkSuccessfulStatus() {
    await expect(this.getSuccessfulLabel().first()).toBeVisible();
  }

  async checkCancelledStatus() {
    await expect(this.getCancelledLabel().first()).toBeVisible();
  }

  async checkWaitingForConfirmationStatus() {
    await expect(this.getWaitingForConfirmationLabel().first()).toBeVisible();
  }

  async checkFailedStatus() {
    // Wait for processing to complete first (ongoing label disappears)
    await expect(this.getOngoingLabel().first()).toBeHidden({ timeout: 30000 });
    await expect(this.getFailedLabel().first()).toBeVisible();
  }

  async confirmImport() {
    const button = this.getConfirmButton();
    await button.click();
    // Wait for status to change to "Completed"
    await expect(this.getSuccessfulLabel().first()).toBeVisible();
  }

  async cancelImport() {
    const button = this.getCancelImportButton();
    await button.click();
    // Wait for status to change to "Cancelled"
    await expect(this.getCancelledLabel().first()).toBeVisible();
  }

  async deleteAllImportResults(apiRequestContext: APIRequestContext) {
    await deleteAllImportResults(apiRequestContext);
  }
}
