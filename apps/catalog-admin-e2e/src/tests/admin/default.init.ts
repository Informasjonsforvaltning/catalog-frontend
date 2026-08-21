import { runTestAsAdmin as initAsAdmin } from "../../fixtures/basePage";
import { adminAuthFile, deleteTestData } from "../../utils/helpers";

initAsAdmin("delete leftover test data", async ({ playwright }) => {
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  await deleteTestData(apiRequestContext);
});
