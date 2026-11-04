import { test, expect } from "../../fixtures/basePage";
import InformationModelsPage from "../../page-object-model/informationModelsPage";
import {
  adminAuthFile,
  generateAccessibilityBuilder,
  getCatalogId,
} from "../../utils/helpers";
import { getRandomInformationModel } from "../../utils/informationModel";

test.use({ storageState: adminAuthFile });

test.describe("information-model-catalog: detail page", () => {
  test("should delete an unpublished information model", async ({
    page,
    createdModels,
    informationModelsPage,
    informationModelDetailPage,
  }) => {
    const catalogId = getCatalogId();
    const informationModel = getRandomInformationModel();
    const { id } = await createdModels.create(informationModel);
    const title = informationModel.title.nb;

    await informationModelDetailPage.goto(catalogId, id);
    await informationModelDetailPage.expectDeleteEnabled(true);
    await informationModelDetailPage.deleteInformationModel();

    await expect(page).toHaveURL(`/catalogs/${catalogId}/information-models`);
    await informationModelsPage.search(title);
    await informationModelsPage.expectInformationModelNotVisible(title);
  });

  test("should publish and unpublish an information model", async ({
    context,
    createdModels,
    informationModelDetailPage,
  }) => {
    const catalogId = getCatalogId();
    const informationModel = getRandomInformationModel();
    const { id } = await createdModels.create(informationModel);
    const title = informationModel.title.nb;

    await informationModelDetailPage.goto(catalogId, id);
    await informationModelDetailPage.publish();
    await informationModelDetailPage.expectDeleteEnabled(false);

    // Check the list in a second tab, so the detail page's post-publish refresh isn't interrupted.
    const listTab = await context.newPage();
    const informationModelsPage = new InformationModelsPage(
      listTab,
      await generateAccessibilityBuilder(listTab),
    );
    await informationModelsPage.goto(catalogId);
    await informationModelsPage.search(title);
    await informationModelsPage.expandPublishedFilter();
    await informationModelsPage.filterPublished();
    await informationModelsPage.expectInformationModelVisible(title);
    await informationModelsPage.clearPublishedFilter();
    await informationModelsPage.filterNotPublished();
    await informationModelsPage.expectInformationModelNotVisible(title);
    await listTab.close();

    await informationModelDetailPage.unpublish();
    await informationModelDetailPage.expectDeleteEnabled(true);
  });
});
