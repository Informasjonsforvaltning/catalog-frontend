import { LocalizedStrings } from "./localization";

export type Cost = {
  value?: number;
  description?: LocalizedStrings;
  documentation?: string[];
  currency?: string;
};
