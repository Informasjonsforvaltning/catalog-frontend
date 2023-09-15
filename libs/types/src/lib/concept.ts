import { AssignedUser } from './user';

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
  navn: TekstMedSpraakKode;
}

export interface Definisjon {
  tekst: TekstMedSpraakKode;
  kildebeskrivelse?: {
    forholdTilKilde: string;
    kilde: Kilde[];
  } | null;
}

export interface TekstMedSpraakKode {
  [kode: string]: string;
}

export interface Navn {
  nb?: any;
  nn?: any;
  en?: any;
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

export interface Relasjon {
  relasjon?: string;
  relasjonsType?: string;
  beskrivelse?: TekstMedSpraakKode;
  inndelingskriterium?: TekstMedSpraakKode;
  relatertBegrep?: string;
}

export interface Concept {
  id: string;
  originaltBegrep?: string;
  versjonsnr?: Version | null;
  revisjonAv?: string;
  anbefaltTerm?: AnbefaltTerm;
  definisjon?: Definisjon;
  folkeligForklaring?: Definisjon;
  rettsligForklaring?: Definisjon;
  ansvarligVirksomhet: { id: string };
  merknad?: Record<string, string[]>;
  merkelapp?: string[];
  eksempel?: Record<string, string[]>;
  fagområde?: Record<string, string[]>;
  fagområdeKoder?: string[];
  bruksområde?: Record<string, string[]>;
  omfang?: UriText | null;
  tillattTerm?: Record<string, string[]>;
  frarådetTerm?: Record<string, string[]>;
  kontaktpunkt?: ContactDetails | null;
  gyldigFom?: string | null;
  gyldigTom?: string | null;
  gjeldendeRevisjon?: string;
  seOgså: string[];
  erstattesAv?: string[];
  statusURI?: string | null;
  erSistPublisert?: boolean;
  revisjonAvSistPublisert?: boolean;
  endringslogelement?: Endringslogelement;
  tildeltBruker?: AssignedUser;
  begrepsRelasjon?: Relasjon[];
  erPublisert?: boolean;
  publiseringsTidspunkt?: string;
  opprettet?: string;
  opprettetAv?: string;
  interneFelt?: Record<string, { value: string }>;
  abbreviatedLabel?: string;
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
  prefLabel?: TekstMedSpraakKode;
}

export interface PublisherRdf {
  id: string;
  uri: string;
  name?: string;
  prefLabel?: TekstMedSpraakKode;
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

export interface ChangeRequest {
  id: string;
  conceptId?: string;
  catalogId: string;
  anbefaltTerm?: AnbefaltTerm;
  tillattTerm?: Record<string, string[]>;
  frarådetTerm?: Record<string, string[]>;
  definisjon?: Definisjon;
}

export type SearchableField = 'anbefaltTerm' | 'frarådetTerm' | 'tillattTerm' | 'definisjon' | 'merknad';

export interface ConceptSearchFulltextHit {
  id: string;
  identifier: string[];
  uri: string;
  publisher?: PublisherRdf;
  prefLabel: TekstMedSpraakKode;
}
