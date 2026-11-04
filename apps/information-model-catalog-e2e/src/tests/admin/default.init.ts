import { test } from "../../fixtures/basePage";
import { deleteStaleTestInformationModels } from "../../utils/helpers";

test("should clean up stale test data", async ({ adminApi }) => {
  await deleteStaleTestInformationModels(adminApi);
});
