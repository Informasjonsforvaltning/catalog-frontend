import { defineConfig } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";
import { createCommonTsConfig } from "../../tools/eslint/shared-eslint-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([createCommonTsConfig(__dirname)]);
