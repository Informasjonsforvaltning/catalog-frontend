import { UriWIthLabel } from './dataset';
import { LocalizedStrings } from './localization';

export interface LosTheme {
  children?: null;
  parents?: string[];
  isTheme?: boolean;
  losPaths: string[];
  name?: LocalizedStrings;
  definition?: null;
  uri: string;
  synonyms?: string[];
  relatedTerms?: null;
  theme?: boolean;
  internalId: null;
}

export interface DataTheme {
  uri: string;
  code?: string;
  label: LocalizedStrings;
  startUse?: string;
  conceptSchema?: UriWIthLabel;
}
