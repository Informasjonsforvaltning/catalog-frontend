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
    const url = `/auth/signin?callbackUrl=/catalogs/${process.env.E2E_CATALOG_ID}/data-services`;
    console.log('[LOGIN PAGE] Navigating to:', url);
    await this.page.goto(url);
    console.log('[LOGIN PAGE] Navigation complete.');
  }

  public async loginAsAdmin() {
    console.log('[LOGIN PAGE] Starting login as admin...');
    try {
      console.log('[LOGIN PAGE] Waiting for "Sign in with Keycloak" button...');
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        console.log('[LOGIN PAGE] Clicking "Sign in with Keycloak" button...');
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      console.log('[LOGIN PAGE] "Sign in with Keycloak" button not found or not visible, proceeding...');
    }

    console.log('[LOGIN PAGE] Clicking "Logg inn via ID-porten"...');
    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    console.log('[LOGIN PAGE] Clicking "TestID på nivå høyt"...');
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker  ' }).click();
    console.log('[LOGIN PAGE] Filling synthetic personidentifikator...');
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_ADMIN_ID}`);
    console.log('[LOGIN PAGE] Clicking "Autentiser"...');
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    console.log('[LOGIN PAGE] Waiting for confirmation text...');
    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    console.log('[LOGIN PAGE] Saving storage state for admin...');
    await this.page.context().storageState({ path: adminAuthFile });
    console.log('[LOGIN PAGE] Login as admin complete.');
  }

  public async loginAsWriteUser() {
    console.log('[LOGIN PAGE] Starting login as write user...');
    try {
      console.log('[LOGIN PAGE] Waiting for "Sign in with Keycloak" button...');
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        console.log('[LOGIN PAGE] Clicking "Sign in with Keycloak" button...');
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      console.log('[LOGIN PAGE] "Sign in with Keycloak" button not found or not visible, proceeding...');
    }

    console.log('[LOGIN PAGE] Clicking "Logg inn via ID-porten"...');
    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    console.log('[LOGIN PAGE] Clicking "TestID på nivå høyt"...');
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker  ' }).click();
    console.log('[LOGIN PAGE] Filling synthetic personidentifikator...');
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_WRITE_ID}`);
    console.log('[LOGIN PAGE] Clicking "Autentiser"...');
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    console.log('[LOGIN PAGE] Waiting for confirmation text...');
    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    console.log('[LOGIN PAGE] Saving storage state for write user...');
    await this.page.context().storageState({ path: writeAuthFile });
    console.log('[LOGIN PAGE] Login as write user complete.');
  }

  public async loginAsReadUser() {
    console.log('[LOGIN PAGE] Starting login as read user...');
    try {
      console.log('[LOGIN PAGE] Waiting for "Sign in with Keycloak" button...');
      await this.signInWithKeycloakButton().waitFor({ state: 'visible', timeout: 5000 });
      if (await this.signInWithKeycloakButton().isVisible()) {
        console.log('[LOGIN PAGE] Clicking "Sign in with Keycloak" button...');
        await this.signInWithKeycloakButton().click();
      }
    } catch {
      console.log('[LOGIN PAGE] "Sign in with Keycloak" button not found or not visible, proceeding...');
    }

    console.log('[LOGIN PAGE] Clicking "Logg inn via ID-porten"...');
    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click({ timeout: 5000 });
    console.log('[LOGIN PAGE] Clicking "TestID på nivå høyt"...');
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker  ' }).click();
    console.log('[LOGIN PAGE] Filling synthetic personidentifikator...');
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_READ_ID}`);
    console.log('[LOGIN PAGE] Clicking "Autentiser"...');
    await this.page.getByRole('button', { name: 'Autentiser' }).click();

    console.log('[LOGIN PAGE] Waiting for confirmation text...');
    await expect(this.page.getByText('ØKONOMISK FREIDIG TIGER AS')).toBeVisible({ timeout: 5000 });

    // End of authentication steps.
    console.log('[LOGIN PAGE] Saving storage state for read user...');
    await this.page.context().storageState({ path: readAuthFile });
    console.log('[LOGIN PAGE] Login as read user complete.');
  }
}
