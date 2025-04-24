import { LocalizedStringLists, LocalizedStrings } from './localization';

export interface Dataset extends DatasetToBeCreated {
  id: string;
  catalogId: string;
  lastModified: string;
  published: boolean;
  approved: boolean;
  modifiedBy?: User;
}

export type DatasetToBeCreated = {
  specializedType?: 'SERIES' | undefined;
  published?: boolean;
  approved?: boolean;
  concepts?: string[];
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  contactPoints?: DatasetContactPoint[];
  keywords?: LocalizedStringLists;
  issued?: string;
  modified?: string;
  language?: string[];
  landingPage?: string[];
  euDataTheme?: string[];
  losTheme?: string[];
  distribution?: Distribution[];
  sample?: Distribution[];
  temporal?: DateRange[];
  spatial?: string[];
  accessRight?: string;
  legalBasisForRestriction?: UriWithLabel[];
  legalBasisForProcessing?: UriWithLabel[];
  legalBasisForAccess?: UriWithLabel[];
  accuracy?: { hasBody?: LocalizedStrings };
  completeness?: { hasBody?: LocalizedStrings };
  currentness?: { hasBody?: LocalizedStrings };
  availability?: { hasBody?: LocalizedStrings };
  relevance?: { hasBody?: LocalizedStrings };
  references?: Reference[];
  relatedResources?: UriWithLabel[];
  provenance?: string;
  frequency?: string; // accrualPeriodicity
  conformsTo?: UriWithLabel[];
  informationModelsFromOtherSources?: UriWithLabel[];
  informationModelsFromFDK?: string[];
  qualifiedAttributions?: string[];
  type?: string;
  inSeries?: string;
  seriesDatasetOrder?: Record<string, number>;
};

export type UriWithLabel = {
  uri?: string;
  prefLabel?: LocalizedStrings;
};

export type DateRange = {
  startDate?: string;
  endDate?: string;
};

export type Reference = {
  referenceType: string;
  source: string;
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
  license?: string;
  conformsTo?: UriWithLabel[];
  page?: string[];
  format?: string[];
  mediaType?: string[];
  accessServices?: string[];
};

export type DatasetContactPoint = {
  email?: string;
  phone?: string;
  url?: string;
  name?: LocalizedStrings;
};

type User = { id: string; name?: string; email?: string };
