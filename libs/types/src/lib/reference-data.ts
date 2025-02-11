import { UriWithLabel } from './dataset';
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
  conceptSchema?: UriWithLabel;
}

export interface ReferenceData {
  losThemes: LosTheme[];
  dataThemes: DataTheme[];
  provenanceStatements: ReferenceDataCode[];
  datasetTypes: ReferenceDataCode[];
  frequencies: ReferenceDataCode[];
  languages: ReferenceDataCode[];
  openLicenses: ReferenceDataCode[];
}

export interface DataServiceReferenceData {
  openLicenses: ReferenceDataCode[];
}
