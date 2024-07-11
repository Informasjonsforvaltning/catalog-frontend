import {
  expect,
  Page,
  BrowserContext,
  TestType,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from '@playwright/test';
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
  public async loginAsAdmin() {
    await this.page.goto(`/auth/signin?callbackUrl=/`);
    await this.page.waitForTimeout(1000);
    if (await this.signInWithKeycloakButton().isVisible()) {
      await this.signInWithKeycloakButton().click();
    }
    await this.page.waitForTimeout(5000);

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_ADMIN_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();
    await this.page.waitForTimeout(5000);

    expect(this.page.getByRole('heading', { name: 'ØKONOMISK FREIDIG TIGER AS' })).toBeVisible();

    // End of authentication steps.
    await this.page.context().storageState({ path: adminAuthFile });
  }

  public async loginAsWriteUser() {
    await this.page.goto(`/auth/signin?callbackUrl=/catalogs/${process.env.E2E_AUTH_WRITE_CATALOG_ID}/services`);
    await this.page.waitForTimeout(1000);
    if (await this.signInWithKeycloakButton().isVisible()) {
      await this.signInWithKeycloakButton().click();
    }
    await this.page.waitForTimeout(5000);

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_WRITE_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();
    await this.page.waitForTimeout(5000);

    // Wait for network to be idle, if we save storage too early, needed storage values might not yet be available
    await this.page.waitForLoadState('networkidle');

    // End of authentication steps.
    await this.page.context().storageState({ path: writeAuthFile });
  }

  public async loginAsReadUser() {
    await this.page.goto(`/auth/signin?callbackUrl=/`);
    await this.page.waitForTimeout(1000);
    if (await this.signInWithKeycloakButton().isVisible()) {
      await this.signInWithKeycloakButton().click();
    }
    await this.page.waitForTimeout(5000);

    await this.page.getByRole('link', { name: 'Logg inn via ID-porten' }).click();
    await this.page.getByRole('link', { name: 'TestID på nivå høyt Lag din egen testbruker " / "' }).click();
    await this.page.getByLabel('Personidentifikator (syntetisk)').fill(`${process.env.E2E_AUTH_READ_ID}`);
    await this.page.getByRole('button', { name: 'Autentiser' }).click();
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('heading', { name: '' }).click();

    // Wait for network to be idle, if we save storage too early, needed storage values might not yet be available
    await this.page.waitForLoadState('networkidle');

    // End of authentication steps.
    await this.page.context().storageState({ path: readAuthFile });
  }
}
