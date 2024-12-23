import type { PublicationStatus } from './enums';
import { LocalizedStrings } from './localization';
import { ReferenceDataCode } from './reference-data';

export interface Dataset extends DatasetToBeCreated {
  id: string;
  catalogId: string;
  _lastModified: string;
}

export type DatasetToBeCreated = {
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
  keyword?: { [key: string]: string }[];
  keywordList?: { nb?: string[]; nn?: string[]; en?: string[] };
  concepts?: [{ uri: string }];
  provenance?: ReferenceDataCode;
  accrualPeriodicity?: ReferenceDataCode;
  modified?: string;
  hasCurrentnessAnnotation?: { hasBody?: LocalizedStrings };
  hasRelevanceAnnotation?: { hasBody?: LocalizedStrings };
  hasCompletenessAnnotation?: { hasBody?: LocalizedStrings };
  hasAvailabilityAnnotation?: { hasBody?: LocalizedStrings };
  hasAccuracyAnnotation?: { hasBody?: LocalizedStrings };
  conformsTo?: UriWithLabel[];
  spatial?: ReferenceDataCode[];
  temporal?: DateRange[];
  issued?: string;
  language?: ReferenceDataCode[];
  informationModel?: UriWithLabel[];
  informationModelsFromFDK?: string[];
  qualifiedAttributions?: string[];
  sample?: Sample[];
  references?: Reference[];
  relations?: UriWithLabel[];
  inSeries?: string;
  distribution?: Distribution[];
  contactPoint: DatasetContactPoint[];
  // Arrays of uris used as helper values for Formik. These properties is not part of the db object.
  losThemeList?: string[];
  euThemeList?: string[];
  conceptList?: string[];
  spatialList?: string[];
  languageList?: string[];
};

export type UriWithLabel = {
  uri?: string;
  prefLabel?: LocalizedStrings;
};

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type Sample = {
  downloadURL?: string[];
  accessURL?: string[];
  format?: string[];
  mediaType?: string[];
  description?: LocalizedStrings;
};
export type Reference = {
  referenceType: { code: string };
  source: { uri: string };
};

export type DatasetSeries = {
  title: string;
  uri: string;
  id: string;
};
export type Distribution = {
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  downloadURL?: string[];
  accessURL?: string[];
  format?: string[];
  mediaType?: string[];
  license?: { uri: string; code: string };
  conformsTo?: UriWithLabel[];
  page?: [{ uri: string }];
  accessService?: [{ uri: string }];
  // Arrays of uris used as helper values for Formik. These properties is not part of the db object.
  accessServiceList?: string[];
};
type DatasetContactPoint = {
  email?: string;
  hasTelephone?: string;
  hasURL?: string;
  organizationUnit?: string;
};
