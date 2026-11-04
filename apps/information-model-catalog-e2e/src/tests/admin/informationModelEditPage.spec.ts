import { test, expect } from "../../fixtures/basePage";
import { adminAuthFile, getCatalogId } from "../../utils/helpers";
import {
  getRandomInformationModel,
  testTitle,
} from "../../utils/informationModel";

test.use({ storageState: adminAuthFile });

test.describe("information-model-catalog: create and edit", () => {
  test("should create a new information model through the form", async ({
    page,
    createdModels,
    informationModelsPage,
    informationModelEditPage,
    informationModelDetailPage,
  }) => {
    const catalogId = getCatalogId();
    const informationModel = getRandomInformationModel();
    const title = informationModel.title.nb;
    const contactPoint = informationModel.contactPoints[0];

    await informationModelsPage.goto(catalogId);
    await informationModelsPage.clickCreateInformationModel();
    await expect(page).toHaveURL(
      `/catalogs/${catalogId}/information-models/new`,
    );

    await informationModelEditPage.fillNewForm({
      title: informationModel.title,
      description: informationModel.description,
      contactName: contactPoint.name,
      email: contactPoint.email,
    });
    await informationModelEditPage.checkAccessibility();
    await informationModelEditPage.save();

    const informationModelId =
      await informationModelEditPage.expectOnEditPageOfCreatedModel(catalogId);
    createdModels.track(informationModelId);

    await informationModelEditPage.expectSaved();
    await informationModelEditPage.expectTitleValue("nb", title);

    await informationModelDetailPage.goto(catalogId, informationModelId);
    await informationModelDetailPage.expectTitle(title);
    await informationModelDetailPage.expectPublished(false);
    await informationModelDetailPage.expectContactPoint(contactPoint.email);
  });

  test("should edit the title of an existing information model", async ({
    page,
    createdModels,
    informationModelEditPage,
    informationModelDetailPage,
  }) => {
    const catalogId = getCatalogId();
    const { id } = await createdModels.create(getRandomInformationModel());
    const newTitle = testTitle("edited_nb");

    await informationModelDetailPage.goto(catalogId, id);
    await informationModelDetailPage.clickEdit();
    await expect(page).toHaveURL(
      `/catalogs/${catalogId}/information-models/${id}/edit`,
    );

    await informationModelEditPage.replaceTitle({ nb: newTitle });
    await informationModelEditPage.save();
    await informationModelEditPage.expectSaved();

    await informationModelDetailPage.goto(catalogId, id);
    await informationModelDetailPage.expectTitle(newTitle);
  });
});
