import { test, expect } from "../../fixtures/basePage";
import { adminAuthFile, getCatalogId } from "../../utils/helpers";
import { getRandomInformationModel } from "../../utils/informationModel";

test.use({ storageState: adminAuthFile });

test.describe("information-model-catalog: information models page", () => {
  test("should find an information model by title and open it", async ({
    page,
    createdModels,
    informationModelsPage,
    informationModelDetailPage,
  }) => {
    const target = getRandomInformationModel();
    const other = getRandomInformationModel();
    const { id } = await createdModels.create(target);
    await createdModels.create(other);
    const targetTitle = target.title.nb;

    await informationModelsPage.goto(getCatalogId());
    await informationModelsPage.checkAccessibility();
    await informationModelsPage.search(targetTitle);

    await informationModelsPage.expectInformationModelVisible(targetTitle);
    await informationModelsPage.expectInformationModelNotVisible(
      other.title.nb,
    );
    await informationModelsPage.expectCardToContainText(
      targetTitle,
      target.description.nb,
    );
    await informationModelsPage.expectCardToContainText(
      targetTitle,
      "Ikke publisert",
    );

    await informationModelsPage.openInformationModel(targetTitle);

    await expect(page).toHaveURL(
      `/catalogs/${getCatalogId()}/information-models/${id}`,
    );
    await informationModelDetailPage.expectTitle(targetTitle);
    await informationModelDetailPage.expectInformationModelId(id);
  });
});
