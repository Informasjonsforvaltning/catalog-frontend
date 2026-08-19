import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";
import * as crypto from "crypto";

export const adminAuthFile = `${__dirname}/../../.playwright/auth/admin.json`;

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
