import { runTestAsAdmin as teardownAsAdmin } from "../../fixtures/basePage";
import { adminAuthFile, deleteAllDatasets } from "../../utils/helpers";

// The specs create around 36 datasets per run and delete none. Wiping after the
// run keeps the shared catalog from filling up between runs.
teardownAsAdmin(
  "delete datasets created by the run",
  async ({ playwright }) => {
    const apiRequestContext = await playwright.request.newContext({
      storageState: adminAuthFile,
    });

    await deleteAllDatasets(apiRequestContext);
  },
);
