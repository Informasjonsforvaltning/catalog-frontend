import { expect, Page, BrowserContext } from '@playwright/test';
import type AxeBuilder from '@axe-core/playwright';
import { adminAuthFile, readAuthFile, writeAuthFile } from '../utils/helpers';

export default class LoginPage {
  page: Page;
  context: BrowserContext;
  accessibilityBuilder;

  constructor(page: Page, context: BrowserContext, accessibilityBuilder?: AxeBuilder) {
    this.page = page;
    this.context = context;
    this.accessibilityBuilder = accessibilityBuilder;
  }

  signInWithKeycloakButton = () => this.page.getByRole('button', { name: 'Sign in with Keycloak' });

  // Helpers
  public async goto() {
    await this.page.goto(`/auth/signin?callbackUrl=/catalogs/${process.env.E2E_CATALOG_ID}/concepts`);
  }

  public async loginAsAdmin() {
    try {
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      // Just proceed
    }

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_ADMIN_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    await this.page.context().storageState({ path: adminAuthFile });
  }

  public async loginAsWriteUser() {
    try {
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      // Just proceed
    }

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_WRITE_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    await this.page.context().storageState({ path: writeAuthFile });
  }

  public async loginAsReadUser() {
    try {
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      // Just proceed
    }

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_READ_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    await this.page.context().storageState({ path: readAuthFile });
  }
}
