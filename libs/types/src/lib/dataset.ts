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
  accessRights?: UriWIthLabel;
  legalBasisForProcessing?: UriWIthLabel[];
  legalBasisForAccess?: UriWIthLabel[];
  legalBasisForRestriction?: UriWIthLabel[];
  landingPage?: string[];
  theme?: { uri: string }[];
  type?: string;
  keyword?: LocalizedStrings[];
  keywordList?: { nb?: string[]; nn?: string[]; en?: string[] };
  concepts?: [{ uri: string }];
  provenance?: ReferenceDataCode;
  accrualPeriodicity?: ReferenceDataCode;
  modified?: string;
  hasCurrentnessAnnotation: { hasBody: LocalizedStrings };
  // Arrays of uris used as helper values for Formik. These properties is not part of the db object.
  losThemeList?: string[];
  euThemeList?: string[];
  conceptList?: string[];
}

export interface UriWIthLabel {
  uri?: string;
  prefLabel?: LocalizedStrings;
}
