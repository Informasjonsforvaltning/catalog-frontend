import type { PublicationStatus } from './enums';
import { LocalizedStrings } from './localization';

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
  losThemeList?: string[]; // An array of los theme uris used as helper values for Formik. This property is not part of the db object.
  euThemeList?: string[]; // An array of eu theme uris used as helper values for Formik. This property is not part of the db object.
}

export interface UriWIthLabel {
  uri?: string;
  prefLabel?: LocalizedStrings;
}
