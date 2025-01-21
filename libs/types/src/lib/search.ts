import { LocalizedStrings } from './localization';
import { ReferenceDataCode } from './reference-data';

export type SearchFilter<T> = {
  value: T;
};

export type QueryFields = {
  title?: boolean;
  description?: boolean;
  keyword?: boolean;
};

export type SearchOperation = {
  query?: string;
  fields?: QueryFields;
  filters?: {
    openData?: SearchFilter<boolean>;
    accessRights?: SearchFilter<string>;
    dataTheme?: SearchFilter<string[]>;
    spatial?: SearchFilter<string[]>;
    provenance?: SearchFilter<string>;
    losTheme?: SearchFilter<string[]>;
    orgPath?: SearchFilter<string>;
    formats?: SearchFilter<string[]>;
    relations?: SearchFilter<string>;
    lastXDays?: SearchFilter<number>;
    lastXDaysModified?: SearchFilter<number>;
    uri?: SearchFilter<string[]>;
  };
  pagination?: {
    page: number;
    size: number;
  };
  sort?: {
    field: 'FIRST_HARVESTED';
    direction: 'ASC' | 'DESC';
  };
  profile?: 'TRANSPORT';
};

export type SearchResult = {
  hits: SearchObject[];
  aggregations: Record<string, BucketCount[]>;
  page: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export type BucketCount = {
  key: string;
  count: number;
};

export type SearchObject = {
  id: string;
  uri: string;
  accessRights?: ReferenceDataCode;
  catalog?: Catalog;
  dataTheme?: EuDataTheme;
  description?: LocalizedStrings;
  fdkFormatPrefixed?: string[];
  metadata?: Metadata;
  isOpenData?: boolean;
  keyword?: LocalizedStrings[];
  losTheme?: LosNode[];
  organization?: Organization;
  provenance?: ReferenceDataCode;
  searchType: SearchType;
  spatial?: ReferenceDataCode[];
  title?: LocalizedStrings;
  relations?: Relation[];
  specializedType?: 'DATASET_SERIES' | 'LIFE_EVENT' | 'BUSINESS_EVENT';
  isAuthoritative?: boolean;
  isRelatedToTransportportal?: boolean;
};

export type Relation = {
  uri?: string;
  type?: RelationType;
};

export type RelationType =
  | 'associativeRelation'
  | 'closeMatch'
  | 'exactMatch'
  | 'generalizes'
  | 'specializes'
  | 'isReplacedBy'
  | 'memberOf'
  | 'replaces'
  | 'seeAlso'
  | 'conformsTo'
  | 'servesDataset'
  | 'inSeries'
  | 'subject'
  | 'hasPart'
  | 'isPartOf'
  | 'isGroupedBy'
  | 'isClassifiedBy'
  | 'isDescribedAt'
  | 'relation'
  | 'hasVersion'
  | 'isVersionOf'
  | 'references'
  | 'isReferencedBy'
  | 'requires'
  | 'isRequiredBy'
  | 'source';

export type Organization = {
  id?: string;
  uri?: string;
  orgPath?: string;
  name?: string;
  prefLabel?: LocalizedStrings;
};

export type Metadata = {
  firstHarvested?: string;
  modified?: string;
  deleted?: boolean;
  timestamp?: number;
};

export type Catalog = {
  description?: LocalizedStrings;
  id?: string;
  publisher?: Organization;
  title?: LocalizedStrings;
  uri?: string;
};

export type LosNode = {
  name?: LocalizedStrings;
  losPaths?: string[];
};

export type EuDataTheme = {
  title?: LocalizedStrings;
  code?: string;
};

export interface Suggestion {
  id: string;
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  uri: string;
  organization?: Organization;
  searchType: SearchType;
}

export type SearchType = 'CONCEPT' | 'DATASET' | 'DATA_SERVICE' | 'INFORMATION_MODEL' | 'SERVICE' | 'EVENT';
export type ResourceType = 'concepts' | 'datasets' | 'data-services' | 'information-models';
