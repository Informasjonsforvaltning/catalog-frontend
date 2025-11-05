import AxeBuilder from "@axe-core/playwright";
import { Locator, Page } from "@playwright/test";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;
export const writeAuthFile = `${__dirname}/../../.playwright/auth/write.json`;
export const readAuthFile = `${__dirname}/../../.playwright/auth/read.json`;

export const generateAccessibilityBuilder = async (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);

export const getStatusText = (uri: string): string => {
  switch (uri) {
    case "http://purl.org/adms/status/Completed":
      return "Ferdigstilt";
    case "http://purl.org/adms/status/Deprecated":
      return "Frarådet";
    case "http://purl.org/adms/status/UnderDevelopment":
      return "Under utvikling";
    case "http://purl.org/adms/status/Withdrawn":
      return "Trukket tilbake";
    default:
      return "Ukjent";
  }
};

export const getParentLocator = (locator: Locator, n: number = 1) => {
  let parent = locator;
  for (let i = 0; i < n; i++) {
    parent = parent.locator("..");
  }
  return parent;
};
