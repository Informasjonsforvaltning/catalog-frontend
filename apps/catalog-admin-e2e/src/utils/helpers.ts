import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";
import * as crypto from "crypto";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;

// Username and internal field names are validated against a regex that allows
// letters, spaces and hyphens only, so no digits or underscores
export function uniqueName(prefix = "test") {
  const letters = Array.from({ length: 12 }, () =>
    String.fromCharCode(97 + crypto.randomInt(0, 26)),
  ).join("");
  return `${prefix}-${letters}`;
}

export function uniqueString(prefix = "catalogAdmin") {
  return `${prefix}_${crypto.randomInt(100000000, 1000000000).toString(36).substring(2, 10)}_${Date.now()}`;
}

export const generateAccessibilityBuilder = async (page: Page) =>
  new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22aa",
    "best-practice",
  ]);
