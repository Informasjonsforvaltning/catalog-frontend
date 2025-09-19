import { BrowserContext, expect, Page } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import ImportResultsPage from './importResultsPage';
import { deleteAllImportResults } from '../utils/helpers';

export default class ImportResultDetailsPage {
  url: string;
  page: Page;
  importResultsPage: ImportResultsPage;
  context: BrowserContext;
  accessibilityBuilder: AxeBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.url = `/catalogs/${process.env.E2E_CATALOG_ID}/concepts/import-results`;
    this.page = page;
    this.importResultsPage = new ImportResultsPage(page, context, accessibilityBuilder);
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  public getButtonByName = (name: string) => this.page.getByRole('button', { name: name });
  public getElementByText = (text: string) => this.page.getByText(text);

  public getCancelImportButton = () => this.getButtonByName('Avvis import');
  public getDeleteImportButton = () => this.getButtonByName('Slett');
  public getConfirmButton = () => this.getButtonByName('Legg til i katalog');

  public getSuccessfulLabel = () => this.getElementByText('Lagt til i katalog');
  public getCancelledLabel = () => this.getElementByText('Avvist');
  public getWaitingForConfirmationLabel = () => this.getElementByText('Til gjennomgang');
  public getFailedLabel = () => this.getElementByText('Feilet');


  async goto(importResultId: string) {
    await this.page.goto(`${this.url}/${importResultId}`);
  }

  async checkVisibleButtons() {
    await expect(this.getCancelImportButton()).toBeVisible({ timeout: 5000 })
    await expect(this.getDeleteImportButton()).toBeVisible({ timeout: 5000 })
    await expect(this.getConfirmButton()).toBeVisible({ timeout: 5000 })
  }

  async checkDisabledDeleteButton() {
    await expect(this.getDeleteImportButton()).toBeDisabled({ timeout: 5000 })
  }

  async checkSuccessfulStatus() {
    await expect(this.getSuccessfulLabel()).toBeVisible({ timeout: 20000 })
  }

  async checkCancelledStatus() {
    await expect(this.getCancelledLabel()).toBeVisible({ timeout: 20000 })
  }

  async checkWaitingForConfirmationStatus() {
    await expect(this.getWaitingForConfirmationLabel()).toBeVisible({ timeout: 30000 })
  }

  async checkFailedStatus() {
    await expect(this.getFailedLabel()).toBeVisible({ timeout: 30000 })
  }

  async confirmImport() {
    await this.getConfirmButton().click({ timeout: 20000 })
  }

  async cancelImport() {
    await this.getCancelImportButton().click({ timeout: 20000 })
  }

  async deleteAllImportResults(apiRequestContext) {
    await deleteAllImportResults(apiRequestContext)
  }
}