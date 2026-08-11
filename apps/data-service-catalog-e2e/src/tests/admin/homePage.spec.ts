import { runTestAsAdmin } from "../../fixtures/basePage";
import HomePage from "../../page-object-model/homePage";

runTestAsAdmin(
  "the home page should redirect us to registration portal",
  async ({ homePage }: { homePage: HomePage }) => {
    await homePage.goto();
    await homePage.checkIfRedirectedToRegistrationPortal();
  },
);
