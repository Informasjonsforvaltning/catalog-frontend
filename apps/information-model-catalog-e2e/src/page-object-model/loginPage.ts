import { expect, Page } from "@playwright/test";
import { adminAuthFile, getCatalogId } from "../utils/helpers";

export default class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private signInWithKeycloakButton = () =>
    this.page.getByRole("button", { name: "Sign in with Keycloak" });

  private async blockUnreachableIdportenAssets() {
    await this.page.route(
      /^https:\/\/(static\.idporten\.no|logo\.test\.idporten\.no|login\.test\.idporten\.no\/(img|js)\/)/,
      (route) => route.abort(),
    );
  }

  async goto() {
    await this.page.goto(
      `/auth/signin?callbackUrl=/catalogs/${getCatalogId()}/information-models`,
    );
  }

  async loginAsAdmin() {
    await this.login(process.env.E2E_AUTH_ADMIN_ID, adminAuthFile);
  }

  private async login(personId: string | undefined, authFile: string) {
    if (!personId) {
      throw new Error("Missing synthetic person id for login");
    }
    await this.blockUnreachableIdportenAssets();

    try {
      await this.signInWithKeycloakButton().click({ timeout: 5000 });
    } catch {
      console.log(
        '[LOGIN PAGE] "Sign in with Keycloak" button not shown, proceeding...',
      );
    }

    await this.page
      .getByRole("link", { name: "Logg inn via ID-porten" })
      .click({ timeout: 5000 });
    await this.page
      .getByRole("link", {
        name: "TestID på nivå høyt Lag din egen testbruker  ",
      })
      .click();
    await this.page
      .getByLabel("Personidentifikator (syntetisk)")
      .fill(personId);
    await this.page.getByRole("button", { name: "Autentiser" }).click();

    await expect(this.page.getByText("ØKONOMISK FREIDIG TIGER AS")).toBeVisible(
      { timeout: 5000 },
    );

    await this.page.context().storageState({ path: authFile });
  }
}
