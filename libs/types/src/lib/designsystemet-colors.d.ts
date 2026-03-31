/**
 * Adds project-specific colors (first, second, third) and severity colors to
 * ColorDefinitions so they are accepted on all Designsystemet components.
 * Without this, components like Button only accept main theme colors + "danger".
 */
import type {} from "@digdir/designsystemet-types";

declare module "@digdir/designsystemet-types" {
  export interface ColorDefinitions {
    first: unknown;
    second: unknown;
    third: unknown;
    info: unknown;
    success: unknown;
    warning: unknown;
    danger: unknown;
  }
}
