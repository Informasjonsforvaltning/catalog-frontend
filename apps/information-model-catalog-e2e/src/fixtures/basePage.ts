import { APIRequestContext, test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import LoginPage from "../page-object-model/loginPage";
import InformationModelsPage from "../page-object-model/informationModelsPage";
import InformationModelDetailPage from "../page-object-model/informationModelDetailPage";
import InformationModelEditPage from "../page-object-model/informationModelEditPage";
import {
  adminAuthFile,
  createInformationModel,
  generateAccessibilityBuilder,
  getInformationModels,
  removeInformationModel,
} from "../utils/helpers";
import { TestInformationModel } from "../utils/informationModel";

type CreatedModels = {
  create: (informationModel: TestInformationModel) => Promise<{ id: string }>;
  track: (informationModelId: string) => void;
};

type Fixtures = {
  accessibilityBuilder: AxeBuilder;
  loginPage: LoginPage;
  informationModelsPage: InformationModelsPage;
  informationModelDetailPage: InformationModelDetailPage;
  informationModelEditPage: InformationModelEditPage;
  adminApi: APIRequestContext;
  createdModels: CreatedModels;
};

export const test = base.extend<Fixtures>({
  accessibilityBuilder: async ({ page }, use) => {
    await use(await generateAccessibilityBuilder(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  informationModelsPage: async ({ page, accessibilityBuilder }, use) => {
    await use(new InformationModelsPage(page, accessibilityBuilder));
  },
  informationModelDetailPage: async ({ page }, use) => {
    await use(new InformationModelDetailPage(page));
  },
  informationModelEditPage: async ({ page, accessibilityBuilder }, use) => {
    await use(new InformationModelEditPage(page, accessibilityBuilder));
  },
  adminApi: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL,
      storageState: adminAuthFile,
    });
    await use(context);
    await context.dispose();
  },
  createdModels: async ({ adminApi }, use) => {
    const ids = new Set<string>();
    await use({
      create: async (informationModel) => {
        const created = await createInformationModel(
          adminApi,
          informationModel,
        );
        ids.add(created.id);
        return created;
      },
      track: (informationModelId) => {
        ids.add(informationModelId);
      },
    });
    const remaining = (await getInformationModels(adminApi)).filter((model) =>
      ids.has(model.id),
    );
    for (const informationModel of remaining) {
      await removeInformationModel(adminApi, informationModel);
    }
  },
});

export { expect } from "@playwright/test";
