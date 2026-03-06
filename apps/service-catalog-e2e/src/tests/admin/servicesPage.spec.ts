import * as crypto from "crypto";
import { Service } from "@catalog-frontend/types";
import { expect, runTestAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  createService,
  publishService,
  ServiceStatus,
  uniqueString,
} from "../../utils/helpers";

runTestAsAdmin(
  "test if the search page renders correctly",
  async ({ servicesPage }) => {
    await servicesPage.goto();
    await servicesPage.checkAccessibility();
    await servicesPage.expectFiltersToBeVisible();
  },
);

runTestAsAdmin("test search", async ({ servicesPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const randomServices: Partial<Service>[] = Array.from({ length: 3 }).map(
    (_, i) => {
      const titleNb = uniqueString(`Test_service_${i + 1}_nb`);
      const titleNn = uniqueString(`Test_service_${i + 1}_nn`);
      const titleEn = uniqueString(`Test_service_${i + 1}_en`);
      const descNb = uniqueString(`This_is_a_test_service_${i + 1}_nb`);
      const descNn = uniqueString(`This_is_a_test_service_${i + 1}_nn`);
      const descEn = uniqueString(`This_is_a_test_service_${i + 1}_en`);
      const result1aId = uniqueString(`result${i + 1}a`);
      const result1bId = uniqueString(`result${i + 1}b`);
      const result1aTitleNb = uniqueString(`Service_result_${i + 1}a_nb`);
      const result1aTitleNn = uniqueString(`Service_result_${i + 1}a_nn`);
      const result1aTitleEn = uniqueString(`Service_result_${i + 1}a_en`);
      const result1aDescNb = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nb`,
      );
      const result1aDescNn = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nn`,
      );
      const result1aDescEn = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_en`,
      );
      const result1bTitleNb = uniqueString(`Service_result_${i + 1}b_nb`);
      const result1bTitleNn = uniqueString(`Service_result_${i + 1}b_nn`);
      const result1bTitleEn = uniqueString(`Service_result_${i + 1}b_en`);
      const result1bDescNb = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nb`,
      );
      const result1bDescNn = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nn`,
      );
      const result1bDescEn = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_en`,
      );
      const contactCategoryNb = uniqueString(
        `Category_contact_point_service_${i + 1}_nb`,
      );
      const contactCategoryNn = uniqueString(
        `Category_contact_point_service_${i + 1}_nn`,
      );
      const contactCategoryEn = uniqueString(
        `Category_contact_point_service_${i + 1}_en`,
      );
      const email = `${uniqueString(`test${i + 1}`)}@example.com`;
      const telephone = `${Math.floor(crypto.randomInt(100000000, 1000000000) * 900000000 + 100000000)}`;
      const contactPage = `https://${uniqueString(`test${i + 1}`)}.contactpage.com`;
      const homepage = `https://${uniqueString(`example${i + 1}`)}.com`;

      return {
        id: undefined,
        catalogId: undefined,
        published: false,
        title: {
          nb: titleNb,
          nn: titleNn,
          en: titleEn,
        },
        description: {
          nb: descNb,
          nn: descNn,
          en: descEn,
        },
        produces: [
          {
            identifier: result1aId,
            title: {
              nb: result1aTitleNb,
              nn: result1aTitleNn,
              en: result1aTitleEn,
            },
            description: {
              nb: result1aDescNb,
              nn: result1aDescNn,
              en: result1aDescEn,
            },
          },
          {
            identifier: result1bId,
            title: {
              nb: result1bTitleNb,
              nn: result1bTitleNn,
              en: result1bTitleEn,
            },
            description: {
              nb: result1bDescNb,
              nn: result1bDescNn,
              en: result1bDescEn,
            },
          },
        ],
        contactPoints: [
          {
            category: {
              nb: contactCategoryNb,
              nn: contactCategoryNn,
              en: contactCategoryEn,
            },
            email,
            telephone,
            contactPage,
          },
        ],
        homepage,
        status:
          ServiceStatus[
            Object.keys(ServiceStatus)[
              i % Object.keys(ServiceStatus).length
            ] as keyof typeof ServiceStatus
          ],
        spatial: [],
      };
    },
  );

  // Create service via API
  for (const service of randomServices) {
    await createService(apiRequestContext, service);
  }

  await servicesPage.goto();
  await servicesPage.search(randomServices[0].title?.nb);
  await servicesPage.expectSearchResults(
    [randomServices[0]],
    [randomServices[1], randomServices[2]],
  );

  await servicesPage.search(uniqueString("search"));
  await servicesPage.expectSearchResults([], randomServices);
});

runTestAsAdmin("test status filter", async ({ servicesPage, playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  const randomServices: Partial<Service>[] = Array.from({ length: 3 }).map(
    (_, i) => {
      const titleNb = uniqueString(`Test_service_${i + 1}_nb`);
      const titleNn = uniqueString(`Test_service_${i + 1}_nn`);
      const titleEn = uniqueString(`Test_service_${i + 1}_en`);
      const descNb = uniqueString(`This_is_a_test_service_${i + 1}_nb`);
      const descNn = uniqueString(`This_is_a_test_service_${i + 1}_nn`);
      const descEn = uniqueString(`This_is_a_test_service_${i + 1}_en`);
      const result1aId = uniqueString(`result${i + 1}a`);
      const result1bId = uniqueString(`result${i + 1}b`);
      const result1aTitleNb = uniqueString(`Service_result_${i + 1}a_nb`);
      const result1aTitleNn = uniqueString(`Service_result_${i + 1}a_nn`);
      const result1aTitleEn = uniqueString(`Service_result_${i + 1}a_en`);
      const result1aDescNb = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nb`,
      );
      const result1aDescNn = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nn`,
      );
      const result1aDescEn = uniqueString(
        `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_en`,
      );
      const result1bTitleNb = uniqueString(`Service_result_${i + 1}b_nb`);
      const result1bTitleNn = uniqueString(`Service_result_${i + 1}b_nn`);
      const result1bTitleEn = uniqueString(`Service_result_${i + 1}b_en`);
      const result1bDescNb = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nb`,
      );
      const result1bDescNn = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nn`,
      );
      const result1bDescEn = uniqueString(
        `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_en`,
      );
      const contactCategoryNb = uniqueString(
        `Category_contact_point_service_${i + 1}_nb`,
      );
      const contactCategoryNn = uniqueString(
        `Category_contact_point_service_${i + 1}_nn`,
      );
      const contactCategoryEn = uniqueString(
        `Category_contact_point_service_${i + 1}_en`,
      );
      const email = `${uniqueString(`test${i + 1}`)}@example.com`;
      const telephone = `${Math.floor(crypto.randomInt(100000000, 1000000000) * 900000000 + 100000000)}`;
      const contactPage = `https://${uniqueString(`test${i + 1}`)}.contactpage.com`;
      const homepage = `https://${uniqueString(`example${i + 1}`)}.com`;

      return {
        id: undefined,
        catalogId: undefined,
        published: false,
        title: {
          nb: titleNb,
          nn: titleNn,
          en: titleEn,
        },
        description: {
          nb: descNb,
          nn: descNn,
          en: descEn,
        },
        produces: [
          {
            identifier: result1aId,
            title: {
              nb: result1aTitleNb,
              nn: result1aTitleNn,
              en: result1aTitleEn,
            },
            description: {
              nb: result1aDescNb,
              nn: result1aDescNn,
              en: result1aDescEn,
            },
          },
          {
            identifier: result1bId,
            title: {
              nb: result1bTitleNb,
              nn: result1bTitleNn,
              en: result1bTitleEn,
            },
            description: {
              nb: result1bDescNb,
              nn: result1bDescNn,
              en: result1bDescEn,
            },
          },
        ],
        contactPoints: [
          {
            category: {
              nb: contactCategoryNb,
              nn: contactCategoryNn,
              en: contactCategoryEn,
            },
            email,
            telephone,
            contactPage,
          },
        ],
        homepage,
        status:
          ServiceStatus[
            Object.keys(ServiceStatus)[
              i % Object.keys(ServiceStatus).length
            ] as keyof typeof ServiceStatus
          ],
        spatial: [],
      };
    },
  );

  // Create service via API
  for (const service of randomServices) {
    await createService(apiRequestContext, service);
  }

  await servicesPage.goto();
  // Filter by status of the first concept
  for (let i = 0; i < randomServices.length; i++) {
    await servicesPage.clearFilters();
    await servicesPage.filterStatus(randomServices[i].status);
    await servicesPage.search(randomServices[i].title?.nb);
    const otherServices = randomServices.filter((_, idx) => idx !== i);
    await servicesPage.expectSearchResults([randomServices[i]], otherServices);
  }

  await servicesPage.clearFilters();
  for (const service of randomServices) {
    await servicesPage.search(service.title?.nb);
    await servicesPage.expectSearchResults(
      [service],
      randomServices.filter((s) => s !== service),
    );
  }
});

runTestAsAdmin(
  "test published state filter",
  async ({ servicesPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    const randomServices: Partial<Service>[] = Array.from({ length: 3 }).map(
      (_, i) => {
        const titleNb = uniqueString(`Test_service_${i + 1}_nb`);
        const titleNn = uniqueString(`Test_service_${i + 1}_nn`);
        const titleEn = uniqueString(`Test_service_${i + 1}_en`);
        const descNb = uniqueString(`This_is_a_test_service_${i + 1}_nb`);
        const descNn = uniqueString(`This_is_a_test_service_${i + 1}_nn`);
        const descEn = uniqueString(`This_is_a_test_service_${i + 1}_en`);
        const result1aId = uniqueString(`result${i + 1}a`);
        const result1bId = uniqueString(`result${i + 1}b`);
        const result1aTitleNb = uniqueString(`Service_result_${i + 1}a_nb`);
        const result1aTitleNn = uniqueString(`Service_result_${i + 1}a_nn`);
        const result1aTitleEn = uniqueString(`Service_result_${i + 1}a_en`);
        const result1aDescNb = uniqueString(
          `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nb`,
        );
        const result1aDescNn = uniqueString(
          `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_nn`,
        );
        const result1aDescEn = uniqueString(
          `This_is_service_result_${i + 1}a_produced_by_service_${i + 1}_en`,
        );
        const result1bTitleNb = uniqueString(`Service_result_${i + 1}b_nb`);
        const result1bTitleNn = uniqueString(`Service_result_${i + 1}b_nn`);
        const result1bTitleEn = uniqueString(`Service_result_${i + 1}b_en`);
        const result1bDescNb = uniqueString(
          `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nb`,
        );
        const result1bDescNn = uniqueString(
          `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_nn`,
        );
        const result1bDescEn = uniqueString(
          `This_is_service_result_${i + 1}b_produced_by_service_${i + 1}_en`,
        );
        const contactCategoryNb = uniqueString(
          `Category_contact_point_service_${i + 1}_nb`,
        );
        const contactCategoryNn = uniqueString(
          `Category_contact_point_service_${i + 1}_nn`,
        );
        const contactCategoryEn = uniqueString(
          `Category_contact_point_service_${i + 1}_en`,
        );
        const email = `${uniqueString(`test${i + 1}`)}@example.com`;
        const telephone = `${Math.floor(crypto.randomInt(100000000, 1000000000) * 900000000 + 100000000)}`;
        const contactPage = `https://${uniqueString(`test${i + 1}`)}.contactpage.com`;
        const homepage = `https://${uniqueString(`example${i + 1}`)}.com`;

        return {
          id: undefined,
          catalogId: undefined,
          published: false,
          title: {
            nb: titleNb,
            nn: titleNn,
            en: titleEn,
          },
          description: {
            nb: descNb,
            nn: descNn,
            en: descEn,
          },
          produces: [
            {
              identifier: result1aId,
              title: {
                nb: result1aTitleNb,
                nn: result1aTitleNn,
                en: result1aTitleEn,
              },
              description: {
                nb: result1aDescNb,
                nn: result1aDescNn,
                en: result1aDescEn,
              },
            },
            {
              identifier: result1bId,
              title: {
                nb: result1bTitleNb,
                nn: result1bTitleNn,
                en: result1bTitleEn,
              },
              description: {
                nb: result1bDescNb,
                nn: result1bDescNn,
                en: result1bDescEn,
              },
            },
          ],
          contactPoints: [
            {
              category: {
                nb: contactCategoryNb,
                nn: contactCategoryNn,
                en: contactCategoryEn,
              },
              email,
              telephone,
              contactPage,
            },
          ],
          homepage,
          status:
            ServiceStatus[
              Object.keys(ServiceStatus)[
                i % Object.keys(ServiceStatus).length
              ] as keyof typeof ServiceStatus
            ],
        };
      },
    );

    // Create service via API
    for (const service of randomServices) {
      const id = await createService(apiRequestContext, service);
      service.id = id;
    }

    await publishService(apiRequestContext, randomServices[0].id as string);

    await servicesPage.goto();
    await servicesPage.filterPublished();
    await servicesPage.search(randomServices[0].title?.nb);
    await servicesPage.expectSearchResults(
      [randomServices[0]],
      [randomServices[1], randomServices[2]],
    );

    await servicesPage.clearFilters();
    for (const service of randomServices) {
      await servicesPage.search(service.title?.nb);
      await servicesPage.expectSearchResults(
        [service],
        randomServices.filter((s) => s !== service),
      );
    }

    await servicesPage.filterNotPublished();
    for (const service of [randomServices[1], randomServices[2]]) {
      await servicesPage.search(service.title?.nb);
      await servicesPage.expectSearchResults(
        [service],
        randomServices.filter((s) => s !== service),
      );
    }
  },
);

runTestAsAdmin(
  "empty submit check prevents save when only whitespace added",
  async ({ page, servicesPage, playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    // Create a service via API with structure matching form expectations
    const service = await createService(apiRequestContext, {
      title: { nb: "Test whitespace", nn: "", en: "" },
      description: { nb: "Test description", nn: "", en: "" },
      produces: [
        {
          identifier: "test-produce-1",
          title: { nb: "Test produce", nn: "", en: "" },
          description: { nb: "Test produce description", nn: "", en: "" },
        },
      ],
      contactPoints: [
        {
          category: { nb: "Test category", nn: "", en: "" },
          email: "test@example.com",
        },
      ],
    });

    // Navigate to edit page
    await page.goto(
      `/catalogs/${process.env.E2E_CATALOG_ID}/services/${service}/edit`,
    );

    // Wait for form to be ready
    const saveButton = page.getByRole("button", { name: "Lagre", exact: true });
    await expect(saveButton).toBeVisible();

    // Add trailing whitespace to title
    const titleField = page
      .getByRole("group", { name: "Tittel Hjelp til utfylling Må fylles ut" })
      .getByLabel("Bokmål");
    await titleField.fill("Test whitespace ");

    // Click save button
    await saveButton.click();

    // Wait for network to settle - if empty submit check works, no request is made
    await page.waitForLoadState("networkidle");

    // Verify NO snackbar appears (empty submit check should prevent save)
    await expect(page.getByText("Endringene ble lagret.")).not.toBeVisible();
    await expect(page.getByText("Lagring feilet")).not.toBeVisible();
  },
);
