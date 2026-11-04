import { expect, Locator, Page } from "@playwright/test";

export default class InformationModelDetailPage {
  readonly page: Page;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly publishSwitch: Locator;
  readonly informationModelId: Locator;
  readonly contactPoint: Locator;
  readonly confirmDeleteDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editButton = page.getByTestId("edit-information-model-button");
    this.deleteButton = page.getByTestId("delete-information-model-button");
    this.publishSwitch = page.getByTestId("information-model-publish-switch");
    this.informationModelId = page.getByTestId("information-model-id");
    this.contactPoint = page.getByTestId("information-model-contact-point");
    this.confirmDeleteDialog = this.confirmDialog("Bekreft sletting");
  }

  async goto(catalogId: string, informationModelId: string) {
    await this.page.goto(
      `/catalogs/${catalogId}/information-models/${informationModelId}`,
    );
  }

  async clickEdit() {
    await this.editButton.click();
  }

  async deleteInformationModel() {
    await this.deleteButton.click();
    await expect(this.confirmDeleteDialog).toBeVisible();
    await this.confirmDeleteDialog
      .getByRole("button", { name: "Slett" })
      .click();
  }

  async expectTitle(title: string) {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async expectInformationModelId(informationModelId: string) {
    await expect(this.informationModelId).toContainText(informationModelId);
  }

  private confirmDialog(title: string) {
    return this.page.getByRole("dialog").filter({ hasText: title });
  }

  async publish() {
    await expect(this.publishSwitch).not.toBeChecked();
    await this.publishSwitch.click();
    await this.confirmDialog("Bekreft publisering")
      .getByRole("button", { name: "Publiser" })
      .click();
    await expect(this.publishSwitch).toBeChecked();
  }

  async unpublish() {
    await expect(this.publishSwitch).toBeChecked();
    await this.publishSwitch.click();
    await this.confirmDialog("Bekreft avpublisering")
      .getByRole("button", { name: "Avpubliser" })
      .click();
    await expect(this.publishSwitch).not.toBeChecked();
  }

  async expectPublished(published: boolean) {
    if (published) {
      await expect(this.publishSwitch).toBeChecked();
    } else {
      await expect(this.publishSwitch).not.toBeChecked();
    }
  }

  async expectDeleteEnabled(enabled: boolean) {
    if (enabled) {
      await expect(this.deleteButton).toBeEnabled();
    } else {
      await expect(this.deleteButton).toBeDisabled();
    }
  }

  async expectContactPoint(text: string) {
    await expect(this.contactPoint).toContainText(text);
  }
}
