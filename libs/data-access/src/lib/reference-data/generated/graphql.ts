export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AdmsStatus = {
  __typename?: 'ADMSStatus';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type AccessRight = {
  __typename?: 'AccessRight';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type ApiSpecification = {
  __typename?: 'ApiSpecification';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  source?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type ApiStatus = {
  __typename?: 'ApiStatus';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type AudienceType = {
  __typename?: 'AudienceType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type ConceptStatus = {
  __typename?: 'ConceptStatus';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type ConceptSubject = {
  __typename?: 'ConceptSubject';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type DataTheme = {
  __typename?: 'DataTheme';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  startUse?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type DatasetType = {
  __typename?: 'DatasetType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  startUse?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type DayOfWeek = {
  __typename?: 'DayOfWeek';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type DistributionType = {
  __typename?: 'DistributionType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  startUse?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type EuroVoc = {
  __typename?: 'EuroVoc';
  children?: Maybe<Array<Scalars['String']['output']>>;
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  parents?: Maybe<Array<Scalars['String']['output']>>;
  uri: Scalars['ID']['output'];
};

export type EvidenceType = {
  __typename?: 'EvidenceType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type FileType = {
  __typename?: 'FileType';
  code?: Maybe<Scalars['String']['output']>;
  mediaType?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type FindByUrIsRequest = {
  types: Array<SearchAlternative>;
  uris: Array<Scalars['String']['input']>;
};

export type Frequency = {
  __typename?: 'Frequency';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type Fylke = {
  __typename?: 'Fylke';
  fylkesnavn?: Maybe<Scalars['String']['output']>;
  fylkesnummer?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type FylkeOrganisasjon = {
  __typename?: 'FylkeOrganisasjon';
  fylkesnavn?: Maybe<Scalars['String']['output']>;
  fylkesnummer?: Maybe<Scalars['String']['output']>;
  organisasjonsnavn?: Maybe<Scalars['String']['output']>;
  organisasjonsnummer?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type Kommune = {
  __typename?: 'Kommune';
  kommunenavn?: Maybe<Scalars['String']['output']>;
  kommunenavnNorsk?: Maybe<Scalars['String']['output']>;
  kommunenummer?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type KommuneOrganisasjon = {
  __typename?: 'KommuneOrganisasjon';
  kommunenavn?: Maybe<Scalars['String']['output']>;
  kommunenummer?: Maybe<Scalars['String']['output']>;
  organisasjonsnavn?: Maybe<Scalars['String']['output']>;
  organisasjonsnummer?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type LinguisticSystem = {
  __typename?: 'LinguisticSystem';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type LocalizedStrings = {
  __typename?: 'LocalizedStrings';
  en?: Maybe<Scalars['String']['output']>;
  nb?: Maybe<Scalars['String']['output']>;
  nn?: Maybe<Scalars['String']['output']>;
  no?: Maybe<Scalars['String']['output']>;
};

export type LosNode = {
  __typename?: 'LosNode';
  children?: Maybe<Array<Scalars['String']['output']>>;
  definition?: Maybe<LocalizedStrings>;
  isTheme: Scalars['Boolean']['output'];
  losPaths?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<LocalizedStrings>;
  parents?: Maybe<Array<Scalars['String']['output']>>;
  relatedTerms?: Maybe<Array<Scalars['String']['output']>>;
  synonyms?: Maybe<Array<Scalars['String']['output']>>;
  uri: Scalars['ID']['output'];
};

export type MainActivity = {
  __typename?: 'MainActivity';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type MediaType = {
  __typename?: 'MediaType';
  name?: Maybe<Scalars['String']['output']>;
  subType?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type Nasjon = {
  __typename?: 'Nasjon';
  nasjonsnavn?: Maybe<Scalars['String']['output']>;
  nasjonsnummer?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type OpenLicense = {
  __typename?: 'OpenLicense';
  code?: Maybe<Scalars['String']['output']>;
  isReplacedBy?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type ProvenanceStatement = {
  __typename?: 'ProvenanceStatement';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type PublisherType = {
  __typename?: 'PublisherType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  accessRightByCode?: Maybe<AccessRight>;
  accessRights: Array<AccessRight>;
  apiSpecificationByCode?: Maybe<ApiSpecification>;
  apiSpecifications: Array<ApiSpecification>;
  apiStatusByCode?: Maybe<ApiStatus>;
  apiStatuses: Array<ApiStatus>;
  audienceTypeByCode?: Maybe<AudienceType>;
  audienceTypes: Array<AudienceType>;
  conceptStatusByCode?: Maybe<ConceptStatus>;
  conceptStatuses: Array<ConceptStatus>;
  conceptSubjects: Array<ConceptSubject>;
  dataThemeByCode?: Maybe<DataTheme>;
  dataThemes: Array<DataTheme>;
  datasetTypeByCode?: Maybe<DatasetType>;
  datasetTypes: Array<DatasetType>;
  dayOfWeekByCode?: Maybe<DayOfWeek>;
  distributionTypeByCode?: Maybe<DistributionType>;
  distributionTypes: Array<DistributionType>;
  euroVocByCode?: Maybe<EuroVoc>;
  euroVocs: Array<EuroVoc>;
  evidenceTypeByCode?: Maybe<EvidenceType>;
  evidenceTypes: Array<EvidenceType>;
  fileTypeByCode?: Maybe<FileType>;
  fileTypes: Array<FileType>;
  findByURIs: Array<SearchHit>;
  frequencies: Array<Frequency>;
  frequencyByCode?: Maybe<Frequency>;
  fylkeByFylkesnummer?: Maybe<Fylke>;
  fylkeOrganisasjonByFylkesnummer?: Maybe<FylkeOrganisasjon>;
  fylkeOrganisasjoner: Array<FylkeOrganisasjon>;
  fylker: Array<Fylke>;
  kommuneByKommunenummer?: Maybe<Kommune>;
  kommuneOrganisasjonByKommunenummer?: Maybe<KommuneOrganisasjon>;
  kommuneOrganisasjoner: Array<KommuneOrganisasjon>;
  kommuner: Array<Kommune>;
  linguisticSystemByCode?: Maybe<LinguisticSystem>;
  linguisticSystems: Array<LinguisticSystem>;
  losThemesAndWords: Array<LosNode>;
  mainActivities: Array<MainActivity>;
  mainActivityByCode?: Maybe<MainActivity>;
  mediaTypeByTypeAndSubType?: Maybe<MediaType>;
  mediaTypes: Array<MediaType>;
  mediaTypesByType: Array<MediaType>;
  nasjonByNasjonsnummer?: Maybe<Nasjon>;
  nasjoner: Array<Nasjon>;
  openLicenseByCode?: Maybe<OpenLicense>;
  openLicenses: Array<OpenLicense>;
  provenanceStatementByCode?: Maybe<ProvenanceStatement>;
  provenanceStatements: Array<ProvenanceStatement>;
  publisherTypeByCode?: Maybe<PublisherType>;
  publisherTypes: Array<PublisherType>;
  referenceTypeByCode?: Maybe<ReferenceType>;
  referenceTypes: Array<ReferenceType>;
  relationshipWithSourceTypeByCode?: Maybe<RelationshipWithSourceType>;
  relationshipWithSourceTypes: Array<RelationshipWithSourceType>;
  roleTypeByCode?: Maybe<RoleType>;
  roleTypes: Array<RoleType>;
  search: Array<SearchHit>;
  serviceChannelTypeByCode?: Maybe<ServiceChannelType>;
  serviceChannelTypes: Array<ServiceChannelType>;
  statusByCode?: Maybe<AdmsStatus>;
  statuses: Array<AdmsStatus>;
  weekDays: Array<DayOfWeek>;
};

export type QueryAccessRightByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryApiSpecificationByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryApiStatusByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryAudienceTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryConceptStatusByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryDataThemeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryDatasetTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryDayOfWeekByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryDistributionTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryEuroVocByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryEvidenceTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryFileTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryFindByUrIsArgs = {
  req: FindByUrIsRequest;
};

export type QueryFrequencyByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryFylkeByFylkesnummerArgs = {
  fylkesnummer: Scalars['String']['input'];
};

export type QueryFylkeOrganisasjonByFylkesnummerArgs = {
  fylkesnummer: Scalars['String']['input'];
};

export type QueryKommuneByKommunenummerArgs = {
  kommunenummer: Scalars['String']['input'];
};

export type QueryKommuneOrganisasjonByKommunenummerArgs = {
  kommunenummer: Scalars['String']['input'];
};

export type QueryLinguisticSystemByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryLosThemesAndWordsArgs = {
  uris?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QueryMainActivityByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryMediaTypeByTypeAndSubTypeArgs = {
  subType: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type QueryMediaTypesByTypeArgs = {
  type: Scalars['String']['input'];
};

export type QueryNasjonByNasjonsnummerArgs = {
  nasjonsnummer: Scalars['String']['input'];
};

export type QueryOpenLicenseByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryProvenanceStatementByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryPublisherTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryReferenceTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryRelationshipWithSourceTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryRoleTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QuerySearchArgs = {
  req: SearchRequest;
};

export type QueryServiceChannelTypeByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryStatusByCodeArgs = {
  code: Scalars['String']['input'];
};

export type ReferenceType = {
  __typename?: 'ReferenceType';
  code?: Maybe<Scalars['ID']['output']>;
  inverseLabel?: Maybe<LocalizedStrings>;
  label?: Maybe<LocalizedStrings>;
};

export type RelationshipWithSourceType = {
  __typename?: 'RelationshipWithSourceType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type RoleType = {
  __typename?: 'RoleType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export enum SearchAlternative {
  AdministrativeEnheter = 'ADMINISTRATIVE_ENHETER',
  EuFileTypes = 'EU_FILE_TYPES',
  IanaMediaTypes = 'IANA_MEDIA_TYPES',
}

export type SearchHit = {
  __typename?: 'SearchHit';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  type?: Maybe<Scalars['String']['output']>;
  uri: Scalars['ID']['output'];
};

export type SearchRequest = {
  query: Scalars['String']['input'];
  types: Array<SearchAlternative>;
};

export type ServiceChannelType = {
  __typename?: 'ServiceChannelType';
  code?: Maybe<Scalars['String']['output']>;
  label?: Maybe<LocalizedStrings>;
  uri: Scalars['ID']['output'];
};

export type SearchQueryVariables = Exact<{
  req: SearchRequest;
}>;

export type SearchQuery = {
  __typename?: 'Query';
  search: Array<{
    __typename?: 'SearchHit';
    uri: string;
    code?: string | null;
    type?: string | null;
    label?: { __typename?: 'LocalizedStrings'; nb?: string | null } | null;
  }>;
};

export type FindByUrIsRequestQueryVariables = Exact<{
  req: FindByUrIsRequest;
}>;

export type FindByUrIsRequestQuery = {
  __typename?: 'Query';
  findByURIs: Array<{
    __typename?: 'SearchHit';
    uri: string;
    code?: string | null;
    type?: string | null;
    label?: { __typename?: 'LocalizedStrings'; nb?: string | null } | null;
  }>;
};
