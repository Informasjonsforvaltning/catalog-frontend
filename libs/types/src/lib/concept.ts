import { LocalizedStrings } from './localization';
import { EntityEnum } from './enums';
import { Organization } from './organization';

export interface ErrorMessage {
  name?: string;
  message?: string;
}

export interface ImportErrorMessage extends ErrorMessage {
  thrown: boolean;
}

export interface InvalidConceptErrorMessage {
  index: number;
  message: string;
  conceptTitle?: string;
}

export interface Kilde {
  uri: string;
  tekst: string;
}

export interface Language {
  code: string;
  title: string;
  selected: boolean;
}

export interface ListItem {
  title: string;
  theme: string;
  valid: string;
  status: string;
}

export default class ImportError {
  constructor(message: string, name?: string) {
    const error = Error(message);

    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });
    Object.defineProperty(error, 'name', {
      get() {
        return name ?? 'ImportError';
      },
    });
    return error;
  }
}

export interface UriText {
  uri?: string;
  tekst?: string;
}

export interface ContactDetails {
  harEpost?: string;
  harTelefon?: string;
}

export interface AnbefaltTerm {
  navn: LocalizedStrings;
}

export interface Definisjon {
  tekst: LocalizedStrings;
  kildebeskrivelse?: {
    forholdTilKilde: string;
    kilde: Kilde[];
  } | null;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface Endringslogelement {
  brukerId: string;
  endringstidspunkt: string;
}

export type Relation = {
  relasjon?: RelationTypeEnum;
  relasjonsType?: RelationSubtypeEnum;
  beskrivelse?: LocalizedStrings;
  inndelingskriterium?: LocalizedStrings;
  relatertBegrep?: string;
  internal?: boolean
};

export enum UnionRelationTypeEnum {
  ASSOSIATIV = 'assosiativ',
  GENERISK = 'generisk',
  PARTITIV = 'partitiv',
  SE_OGSÅ = 'seOgså',
  ERSTATTES_AV = 'erstattesAv',
}

export enum UnionRelationSubtypeEnum {
  OVERORDNET = 'overordnet',
  UNDERORDNET = 'underordnet',
  ER_DEL_AV = 'erDelAv',
  OMFATTER = 'omfatter',
}

export type UnionRelation = Relation & {
  internal?: boolean;
};

export enum RelationTypeEnum {
  ASSOSIATIV = 'assosiativ',
  GENERISK = 'generisk',
  PARTITIV = 'partitiv',
  SE_OGSÅ = 'seOgså',
  ERSTATTES_AV = 'erstattesAv',
}

export enum RelationSubtypeEnum {
  OVERORDNET = 'overordnet',
  UNDERORDNET = 'underordnet',
  ER_DEL_AV = 'erDelAv',
  OMFATTER = 'omfatter',
}

export type RelatedConcept = {
  id?: string;
  identifier?: string;
  href?: string;
  externalHref?: boolean;
  title: LocalizedStrings;
  description?: LocalizedStrings;
  custom?: boolean;
};

export interface Concept {
  abbreviatedLabel?: string | null;
  anbefaltTerm?: AnbefaltTerm;
  ansvarligVirksomhet: { id: string };
  assignedUser?: string;
  begrepsRelasjon?: Relation[];
  definisjon?: Definisjon;
  definisjonForAllmennheten?: Definisjon;
  definisjonForSpesialister?: Definisjon;
  endringslogelement?: Endringslogelement;
  erstattesAv?: string[];
  eksempel?: Record<string, string>;
  fagområde?: Record<string, string[]>;
  fagområdeKoder?: string[];
  frarådetTerm?: Record<string, string[]>;
  gyldigFom?: string | null;
  gyldigTom?: string | null;
  id: string | null;
  internBegrepsRelasjon?: Relation[];
  internErstattesAv?: string[];
  interneFelt?: Record<string, { value: string }>;
  internSeOgså?: string[];
  kontaktpunkt?: ContactDetails | null;
  merkelapp?: string[];
  merknad?: Record<string, string>;
  omfang?: UriText | null;
  opprettet?: string;
  opprettetAv?: string;
  originaltBegrep?: string;
  publiseringsTidspunkt?: string;
  seOgså: string[];
  sistPublisertId?: string;
  statusURI?: string | null;
  tillattTerm?: Record<string, string[]>;
  versjonsnr?: Version | null;
  erPublisert?: boolean;
  revisjonAv?: string;
}

export interface ConceptDefinition {
  text?: LocalizedStrings;
  remark?: LocalizedStrings;
  sources?: Array<{ text?: string; uri?: string }>;
  range?: { text?: LocalizedStrings; uri?: string };
  sourceRelationship?: string;
}

export interface Harvest {
  firstHarvested: string;
  lastHarvested: string;
}

interface ConceptContactPoint {
  email: string;
  telephone: string;
}

export interface ConceptSubject {
  label?: LocalizedStrings;
}

export interface ResponseEntity {
  id: string;
  type: EntityEnum.CONCEPT;
  uri: string;
  identifier: string;
  prefLabel: LocalizedStrings;
  altLabel?: LocalizedStrings[];
  hiddenLabel?: LocalizedStrings[];
  definition?: ConceptDefinition;
  publisher: Partial<Organization>;
  example: LocalizedStrings;
  subject?: Partial<ConceptSubject>[];
  range?: LocalizedStrings[];
  harvest?: Partial<Harvest>;
  contactPoint?: Partial<ConceptContactPoint>;
  validFromIncluding?: string;
  validToIncluding?: string;
  seeAlso?: string[];
  isReplacedBy?: string[];
  replaces?: string[];
  associativeRelation?: Partial<AssociativeRelation>[];
  partitiveRelation?: Partial<PartitiveRelation>[];
  genericRelation?: Partial<GenericRelation>[];
  created?: string;
  memberOf?: string[];
}

export interface SkosConcept {
  id: string;
  identifier: string;
  prefLabel: {
    nb?: string;
    nn?: string;
    en?: string;
  };
  definition: {
    text?: string;
  };
  publisher: Publisher;
}

export interface Collection {
  id: string;
  antallBegrep: number;
}

export interface Publisher {
  organizationId?: string;
  name?: string;
  prefLabel?: LocalizedStrings;
}

export interface PublisherRdf {
  id: string;
  uri: string;
  name?: string;
  prefLabel?: LocalizedStrings;
}

export interface ConceptHitPage {
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface QuerySort {
  field: string;
  direction: string;
}

export interface QueryFilters {
  published?: {
    value: boolean;
  };
  status?: {
    value: string[];
  };
  originalId?: {
    value: string[];
  };
}
export interface SearchConceptQuery {
  query: string;
  pagination: {
    page: number;
    size: number;
  };
  fields: string[];
  sort: QuerySort;
  filters: QueryFilters;
}

export interface SearchConceptResponse {
  hits: Concept[];
  page: ConceptHitPage;
}

export type SearchableField = 'anbefaltTerm' | 'frarådetTerm' | 'tillattTerm' | 'definisjon' | 'merknad';

export interface ConceptSearchFulltextHit {
  id: string;
  identifier: string[];
  uri: string;
  publisher?: PublisherRdf;
  prefLabel: LocalizedStrings;
}

export interface AssociativeRelation {
  description: LocalizedStrings;
  related: string;
}

export interface PartitiveRelation {
  description: LocalizedStrings;
  hasPart: string;
  isPartOf: string;
}

export interface GenericRelation {
  divisioncriterion: LocalizedStrings;
  generalizes: string;
  specializes: string;
}

export type RelationshipWithSource = 'egendefinert' | 'basertPaaKilde' | 'sitatFraKilde';
