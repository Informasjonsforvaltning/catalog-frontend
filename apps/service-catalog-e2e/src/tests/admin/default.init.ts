import { runTestAsAdmin as initAsAdmin } from "../../fixtures/basePage";
import {
  adminAuthFile,
  deleteAllPublicServices,
  deleteAllServices,
} from "../../utils/helpers";

initAsAdmin("delete all existing services", async ({ playwright }) => {
  // Create a request context with the admin storage state (includes next-auth cookie)
  const apiRequestContext = await playwright.request.newContext({
    storageState: adminAuthFile,
  });

  await deleteAllServices(apiRequestContext);
  await deleteAllPublicServices(apiRequestContext);
});
