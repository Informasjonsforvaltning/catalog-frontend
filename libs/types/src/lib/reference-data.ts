import { UriWIthLabel } from './dataset';
import { LocalizedStrings } from './localization';

export interface ReferenceDataCode {
  uri: string;
  code?: string;
  label?: Record<string, string>;
}

export interface ConceptStatuses {
  conceptStatuses: ReferenceDataCode[];
}

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

export interface FileType {
  code: string;
  mediaType: string;
  uri: string;
}

export interface MediaType {
  name: string;
  subType: string;
  type: string;
  uri: string;
}
