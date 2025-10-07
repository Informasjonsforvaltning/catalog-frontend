import { expect, Page, BrowserContext, Locator } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';

export default class DataServiceDetailPage {
  protected page: Page;
  protected context: BrowserContext;
  protected accessibilityBuilder: AxeBuilder;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly publishSwitch: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly endpointUrl: Locator;
  readonly contactPoint: Locator;
  readonly publicationState: Locator;
  readonly publicationDate: Locator;
  readonly dataServiceId: Locator;
  readonly modifiedDate: Locator;
  readonly accessRights: Locator;
  readonly availability: Locator;
  readonly contactName: Locator;
  readonly contactEmail: Locator;
  readonly contactPhone: Locator;
  readonly contactUrl: Locator;
  readonly versionInfo: Locator;
  readonly confirmModal: Locator;
  readonly confirmModalSuccessButton: Locator;
  readonly confirmModalCancelButton: Locator;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
    this.editButton = page.getByTestId('edit-data-service-button');
    this.deleteButton = page.getByTestId('delete-data-service-button');
    this.publishSwitch = page.getByTestId('data-service-publish-switch');
    this.title = page.locator('h2');
    this.description = page.getByTestId('data-service-description');
    this.endpointUrl = page.getByTestId('data-service-endpoint-url');
    this.contactPoint = page.getByTestId('data-service-contact-point');
    this.publicationState = page.getByTestId('data-service-publication-state');
    this.publicationDate = page.getByTestId('data-service-publication-date');
    this.dataServiceId = page.getByTestId('data-service-id');
    this.modifiedDate = page.getByTestId('data-service-modified-date');
    this.accessRights = page.getByTestId('data-service-access-rights');
    this.availability = page.getByTestId('data-service-availability');
    this.contactName = page.getByTestId('data-service-contact-name');
    this.contactEmail = page.getByTestId('data-service-contact-email');
    this.contactPhone = page.getByTestId('data-service-contact-phone');
    this.contactUrl = page.getByTestId('data-service-contact-url');
    this.versionInfo = page.getByTestId('data-service-version');
    this.confirmModal = page.locator('dialog[open]');
    this.confirmModalSuccessButton = page.locator('dialog[open] button').first();
    this.confirmModalCancelButton = page.locator('dialog[open] button').nth(1);
  }

  // Navigation
  async goto(catalogId: string, dataServiceId: string) {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await this.page.goto(`/catalogs/${catalogId}/data-services/${dataServiceId}`);

        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');

        // Check if we're on a 404 page by looking for the title element
        const descriptionElement = await this.description;
        const isDescriptionVisible = await descriptionElement.isVisible();

        if (isDescriptionVisible) {
          // Successfully loaded the data service
          console.log(`[DataServiceDetailPage] Successfully loaded data service after ${retryCount + 1} attempts`);
          return;
        }

        // If we get here, we're probably on a 404 page
        console.log(
          `[DataServiceDetailPage] Data service not found, retrying in 1s (attempt ${retryCount + 1}/${maxRetries})`,
        );
        await this.page.waitForTimeout(1000);
        retryCount++;
      } catch (error) {
        console.error(`[DataServiceDetailPage] Error during navigation attempt ${retryCount + 1}:`, error);
        retryCount++;
        if (retryCount >= maxRetries) {
          throw error;
        }
        await this.page.waitForTimeout(1000);
      }
    }

    // If we get here, all retries failed
    throw new Error(`Failed to load data service after ${maxRetries} attempts`);
  }

  // Actions
  async clickEdit() {
    await this.editButton.click();
  }

  async clickDelete() {
    await this.deleteButton.click();
    // Wait for confirmation modal and confirm
    await this.confirmModal.waitFor({ state: 'visible' });
    await this.confirmModalSuccessButton.click();
  }

  async clickPublish() {
    await this.publishSwitch.click();
    // Wait for confirmation modal and confirm
    await this.confirmModal.waitFor({ state: 'visible' });
    await this.confirmModalSuccessButton.click();
  }

  async clickUnpublish() {
    await this.publishSwitch.click();
    // Wait for confirmation modal and confirm
    await this.confirmModal.waitFor({ state: 'visible' });
    await this.confirmModalSuccessButton.click();
  }

  // Assertions
  async expectTitleToBe(title: string) {
    await expect(this.title).toHaveText(title);
  }

  async expectDescriptionToBe(description: string) {
    await expect(this.description).toContainText(description);
  }

  async expectEndpointUrlToBe(url: string) {
    await expect(this.endpointUrl).toContainText(url);
  }

  async expectContactPointToBe(contactPoint: string) {
    await expect(this.contactPoint).toContainText(contactPoint);
  }

  async expectPublishedStatusToBe(published: boolean) {
    if (published) {
      await expect(this.publicationDate).toContainText('Publisert');
    } else {
      await expect(this.publicationDate).not.toContainText('Publisert');
    }
  }

  async expectEditButtonVisible() {
    await expect(this.editButton).toBeVisible();
  }

  async expectDeleteButtonVisible() {
    await expect(this.deleteButton).toBeVisible();
  }

  async expectPublishButtonVisible() {
    await expect(this.publishSwitch).toBeVisible();
  }

  async expectUnpublishButtonVisible() {
    await expect(this.publishSwitch).toBeVisible();
  }

  async expectDataServiceDetailPageUrl(catalogId: string, dataServiceId: string) {
    await expect(this.page).toHaveURL(`/catalogs/${catalogId}/data-services/${dataServiceId}`);
  }

  async expectDataServiceIdToBe(id: string) {
    await expect(this.dataServiceId).toContainText(id);
  }

  async expectModifiedDateToBe(date: string) {
    await expect(this.modifiedDate).toContainText(date);
  }

  async expectAccessRightsToBe(accessRights: string) {
    await expect(this.accessRights).toContainText(accessRights);
  }

  async expectAvailabilityToBe(availability: string) {
    await expect(this.availability).toContainText(availability);
  }

  async expectContactNameToBe(name: string) {
    await expect(this.contactName).toContainText(name);
  }

  async expectContactEmailToBe(email: string) {
    await expect(this.contactEmail).toContainText(email);
  }

  async expectContactPhoneToBe(phone: string) {
    await expect(this.contactPhone).toContainText(phone);
  }

  async expectContactUrlToBe(url: string) {
    await expect(this.contactUrl).toContainText(url);
  }

  async expectVersionInfoToBe(version: string) {
    await expect(this.versionInfo).toContainText(version);
  }

  // Modal assertions
  async expectConfirmModalVisible() {
    await expect(this.confirmModal).toBeVisible();
  }

  async expectConfirmModalNotVisible() {
    await expect(this.confirmModal).not.toBeVisible();
  }

  // Accessibility
  async checkAccessibility() {
    if (!this.accessibilityBuilder) {
      return;
    }
    const result = await this.accessibilityBuilder
      .disableRules(['svg-img-alt', 'aria-toggle-field-name', 'target-size'])
      .analyze();
    expect.soft(result.violations).toEqual([]);
  }
}
