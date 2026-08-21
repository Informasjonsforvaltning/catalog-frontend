import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createConcept,
  deleteConcept,
  uniqueString,
} from "../../utils/helpers";

const catalogId = () => process.env.E2E_CATALOG_ID as string;

runTestAsAdmin(
  "should create a new concept from the registration form",
  async ({ conceptsPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const term = uniqueString("nytt_begrep_nb");
    let id = "";

    try {
      id = await conceptsPage.createMinimalConceptUsingForm(term);
      expect(id).not.toEqual("");

      await expect(
        conceptsPage.page
          .getByRole("group", { name: /Anbefalt term/ })
          .getByRole("textbox", { name: "Bokmål" }),
      ).toHaveValue(term);
    } finally {
      if (id) {
        await deleteConcept(apiRequestContext, id);
      }
    }
  },
);

runTestAsAdmin(
  "should show a form error when required fields are enforced",
  async ({ conceptsPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const term = uniqueString("validering_nb");
    const id = await createConcept(apiRequestContext, {
      anbefaltTerm: { navn: { nb: term, nn: "", en: "" } },
    });

    try {
      await conceptsPage.editPage.goto(id);

      // Unchecking applies the full schema, which needs nynorsk, a definition
      // and a contact point on top of the bokmål term
      await conceptsPage.page
        .getByRole("checkbox", { name: "Ignorer påkrevde felt" })
        .uncheck();
      await conceptsPage.page.getByRole("button", { name: "Lagre" }).click();

      // The form level alert, rather than the per language messages inside the
      // fieldsets, which render several spans in one ValidationMessage
      await expect(
        conceptsPage.page.getByText(
          "Skjemaet inneholder feil. Sjekk feltene i rødt.",
        ),
      ).toBeVisible();
      await expect(
        conceptsPage.page.getByText("Endringene ble lagret."),
      ).toHaveCount(0);
    } finally {
      await deleteConcept(apiRequestContext, id);
    }
  },
);

runTestAsAdmin(
  "should not allow publishing a concept with missing required fields",
  async ({ conceptsPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const term = uniqueString("publiser_nb");
    const id = await createConcept(apiRequestContext, {
      anbefaltTerm: { navn: { nb: term, nn: "", en: "" } },
    });

    try {
      await conceptsPage.detailPage.goto(
        `/catalogs/${catalogId()}/concepts/${id}`,
      );

      // The concept only has a bokmål term, so it fails the full schema and the
      // switch is read only. Publishing is deliberately not exercised: it cannot
      // be undone and deleteAllConcepts skips published concepts.
      await expect(
        conceptsPage.page.getByRole("button", { name: "Valideringsfeil" }),
      ).toBeVisible();

      const publishSwitch = conceptsPage.page.getByRole("switch", {
        name: "Ikke publisert",
      });
      await expect(publishSwitch).not.toBeChecked();
      await publishSwitch.click();
      await expect(publishSwitch).not.toBeChecked();
    } finally {
      await deleteConcept(apiRequestContext, id);
    }
  },
);

runTestAsAdmin(
  "should delete a concept from the detail page",
  async ({ conceptsPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });
    const term = uniqueString("slett_nb");
    const id = await createConcept(apiRequestContext, {
      anbefaltTerm: { navn: { nb: term, nn: "", en: "" } },
    });

    await conceptsPage.detailPage.goto(
      `/catalogs/${catalogId()}/concepts/${id}`,
    );
    await conceptsPage.detailPage.deleteConcept(term);

    // The delete mutation does not await the request, so landing on the catalog
    // page is not proof. Verify through the API.
    const response = await apiRequestContext.get(
      `/api/catalogs/${catalogId()}/concepts/${id}`,
    );
    expect(response.ok()).toBeFalsy();
  },
);
