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
}

export interface UriWIthLabel {
  uri?: string;
  prefLabel?: LocalizedStrings;
}
