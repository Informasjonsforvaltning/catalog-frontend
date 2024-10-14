import type { PublicationStatus } from './enums';
import { LocalizedStrings } from './localization';
import { ReferenceDataCode } from './reference-data';

export interface Dataset extends DatasetToBeCreated {
  id: string;
  catalogId: string;
  _lastModified: string;
}
export interface DatasetToBeCreated {
  title: LocalizedStrings;
  description: LocalizedStrings;
  registrationStatus: PublicationStatus;
  specializedType?: 'SERIES' | undefined;
  accessRights?: UriWithLabel;
  legalBasisForProcessing?: UriWithLabel[];
  legalBasisForAccess?: UriWithLabel[];
  legalBasisForRestriction?: UriWithLabel[];
  landingPage?: string[];
  theme?: { uri: string }[];
  type?: string;
  keyword?: LocalizedStrings[];
  keywordList?: { nb?: string[]; nn?: string[]; en?: string[] };
  concepts?: [{ uri: string }];
  provenance?: ReferenceDataCode;
  accrualPeriodicity?: ReferenceDataCode;
  modified?: string;
  hasCurrentnessAnnotation?: { hasBody: LocalizedStrings };
  hasRelevanceAnnotation?: { hasBody: LocalizedStrings };
  hasCompletenessAnnotation?: { hasBody: LocalizedStrings };
  hasAvailabilityAnnotation?: { hasBody: LocalizedStrings };
  hasAccuracyAnnotation?: { hasBody: LocalizedStrings };
  conformsTo?: UriWithLabel[];
  spatial?: ReferenceDataCode[];
  temporal?: DateRange[];
  issued?: string;
  language?: ReferenceDataCode[];
  // Arrays of uris used as helper values for Formik. These properties is not part of the db object.
  losThemeList?: string[];
  euThemeList?: string[];
  conceptList?: string[];
  spatialList?: string[];
  languageList?: string[];
}

export interface UriWithLabel {
  uri?: string;
  prefLabel?: LocalizedStrings;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}
