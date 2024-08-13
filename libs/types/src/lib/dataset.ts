import { LocalizedStrings } from './localization';

export interface Dataset {
  id: string;
  catalogId: string;
  _lastModified: string;
  registrationStatus?: string;
  concepts?: {
    uri: string;
    prefLabel: LocalizedStrings;
  }[];
  uri: string;
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  keyword?: string[];
  publisher?: {
    uri: string;
    id: string;
    name: string;
  };
  landingPage?: string[];
  references?: {
    referenceType?: {
      code: string;
      prefLabel: LocalizedStrings;
    };
    source?: {
      uri: string;
      prefLabel: LocalizedStrings;
    };
  }[];
  relations?: {
    uri: string;
    prefLabel?: LocalizedStrings;
  }[];
  specializedType?: 'SERIES' | undefined;
}
