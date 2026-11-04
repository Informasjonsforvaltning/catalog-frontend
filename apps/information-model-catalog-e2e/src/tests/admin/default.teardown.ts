import { test } from "../../fixtures/basePage";
import { deleteTestInformationModelsFromThisRun } from "../../utils/helpers";

test("should remove information models created by the run", async ({
  adminApi,
}) => {
  await deleteTestInformationModelsFromThisRun(adminApi);
});
