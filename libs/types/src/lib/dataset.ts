import { LocalizedStrings } from "./localization";

export interface Dataset extends DatasetToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
  lastModified: string;
  uri?: string;
  originalUri?: string;
}

export type DatasetToBeCreated = {
  schemaType?: string;
  title: LocalizedStrings;
  description: LocalizedStrings;
  approved: boolean;
  specializedType?: "SERIES" | undefined;
  accessRight?: string;
  legalBasisForProcessing?: UriWithLabel[];
  legalBasisForAccess?: UriWithLabel[];
  legalBasisForRestriction?: UriWithLabel[];
  landingPage?: string[];
  euDataTheme?: string[];
  losTheme?: string[];
  mobilityTheme?: string[];
  type?: string;
  keywords?: LocalizedStrings;
  concepts?: string[];
  provenance?: string;
  frequency?: string;
  modified?: string;
  currentness?: { hasBody?: LocalizedStrings };
  relevance?: { hasBody?: LocalizedStrings };
  completeness?: { hasBody?: LocalizedStrings };
  availability?: { hasBody?: LocalizedStrings };
  accuracy?: { hasBody?: LocalizedStrings };
  conformsTo?: UriWithLabel[];
  spatial?: string[];
  temporal?: DateRange[];
  issued?: string;
  language?: string[];
  informationModelsFromOtherSources?: UriWithLabel[];
  informationModelsFromFDK?: string[];
  qualifiedAttributions?: string[];
  sample?: Partial<Distribution>[];
  references?: Reference[];
  relatedResources?: UriWithLabel[];
  inSeries?: string;
  distribution?: Distribution[];
  contactPoints: DatasetContactPoint[];
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
  referenceType?: string;
  source?: string;
};

export type DatasetSeries = {
  title: string;
  uri: string;
  id: string;
};

export type Rights = {
  type?: string;
}

export type Distribution = {
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  downloadURL?: string[];
  accessURL?: string[];
  format?: string[];
  mediaType?: string[];
  license?: string;
  conformsTo?: UriWithLabel[];
  page?: string[];
  accessServices?: string[];
  mobilityDataStandard?: string;
  rights?: Rights;
};

type DatasetContactPoint = {
  name?: LocalizedStrings;
  email?: string;
  phone?: string;
  url?: string;
};

export type DatasetsPageSettings = {
  search: string | null;
  sort: string | null;
  page: number | null;
  filter: {
    status: string[] | null;
    pubState: string[] | null;
  };
};
