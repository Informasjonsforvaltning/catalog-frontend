import { Concept } from '../../../../libs/types/src';

export const CONCEPT_1: Concept = {
  id: null,
  anbefaltTerm: {
    navn: {
      nb: 'Test concept 1 nb',
      nn: 'Test concept 1 nn',
      en: 'Test concept 1 en',
    },
  },
  ansvarligVirksomhet: {
    id: null
  },
  definisjon: {
    tekst: { nb: 'This is a test concept 1 nb', nn: 'This is a test concept 1 nn', en: 'This is a test concept 1 en' },
    kildebeskrivelse: {
      forholdTilKilde: 'egendefinert',
      kilde: []
    }
  },   
  kontaktpunkt: {    
    harEpost: 'test1@example.com',
    harTelefon: '123456789',
    //harSkjema: 'https://test1.contactpage.com',
  },
  versjonsnr: {major: 0, minor: 1, patch: 0},
  merknad: {},
  merkelapp: [],
  eksempel: null,
  fagområde: null,
  fagområdeKoder: null,
  omfang: null,
  tillattTerm: null,
  frarådetTerm: null,
  gyldigFom: null,
  gyldigTom: null,
  seOgså: [],
  internBegrepsRelasjon: [],
  internSeOgså: [],
  internErstattesAv: [],
  erstattesAv: [],
  statusURI: 'http://publications.europa.eu/resource/authority/concept-status/DRAFT',
  assignedUser: null,
  begrepsRelasjon: [],
  interneFelt: null,
  abbreviatedLabel: 'TC1'
};

export const CONCEPT_2: Concept = {
  id: null,
  anbefaltTerm: {
    navn: {
      nb: 'Test concept 2 nb',
      nn: 'Test concept 2 nn',
      en: 'Test concept 2 en',
    },
  },
  ansvarligVirksomhet: {
    id: null
  },
  definisjon: {
    tekst: { nb: 'This is a test concept 2 nb', nn: 'This is a test concept 2 nn', en: 'This is a test concept 2 en' },
    kildebeskrivelse: {
      forholdTilKilde: 'basertPaaKilde',
      kilde: [{
        tekst: 'Kilde concept 2',
        uri: 'https://kilde.concept2.no'
      }]
    }
  },   
  kontaktpunkt: {    
    harEpost: 'test2@example.com',
    harTelefon: '123456789',
    //: 'https://test2.contactpage.com',
  },
  versjonsnr: {major: 1, minor: 2, patch: 1},
  merknad: {
    nb: 'Merknad test concept 2 nb',
    nn: 'Merknad test concept 2 nn',
    en: 'Merknad test concept 2 en',
  },
  merkelapp: [
    'merkelapp1', 'merkelapp2'
  ],
  eksempel: {
    nb: 'Eksempel test concept 2 nb',
    nn: 'Eksempel test concept 2 nn',
    en: 'Eksempel test concept 2 en',
  },
  fagområde: null,
  fagområdeKoder: null,
  omfang: {
    tekst: 'Omfang concept 2',
    uri: 'https://omfang.concept2.no'
  },
  tillattTerm: {
    nb: ['tillat-term1 nb', 'tillat-term2 nb'],
    nn: ['tillat-term1 nn', 'tillat-term2 nn'],
    en: ['tillat-term1 en', 'tillat-term2 en'],
  },
  frarådetTerm: {
    nb: ['frarådet-term1 nb', 'frarådet-term2 nb'],
    nn: ['frarådet-term1 nn', 'frarådet-term2 nn'],
    en: ['frarådet-term1 en', 'frarådet-term2 en'],
  },
  gyldigFom: '2199-01-01',
  gyldigTom: null,
  seOgså: [],
  internBegrepsRelasjon: [],
  internSeOgså: [],
  internErstattesAv: [],
  erstattesAv: [],
  statusURI: 'http://publications.europa.eu/resource/authority/concept-status/CURRENT',
  assignedUser: null,
  begrepsRelasjon: [],
  interneFelt: null,
  abbreviatedLabel: 'TC2'
};

export const CONCEPT_3: Concept = {
  id: null,
  anbefaltTerm: {
    navn: {
      nb: 'Test concept 3 nb',
      nn: 'Test concept 3 nn',
      en: 'Test concept 3 en',
    },
  },
  ansvarligVirksomhet: {
    id: null
  },
  definisjon: {
    tekst: { nb: 'This is a test concept 3 nb', nn: 'This is a test concept 3 nn', en: 'This is a test concept 3 en' },
    kildebeskrivelse: {
      forholdTilKilde: 'sitatFraKilde',
      kilde: [{
        tekst: 'Kilde concept 3',
        uri: 'https://kilde.concept3.no'
      }]
    }
  },   
  kontaktpunkt: {    
    harEpost: 'test3@example.com',
    harTelefon: '123456789',
    //harSkjema: 'https://test3.contactpage.com',
  },
  versjonsnr: {major: 1, minor: 2, patch: 3},
  merknad: {
    nb: 'Merknad test concept 3 nb',
    nn: 'Merknad test concept 3 nn',
    en: 'Merknad test concept 3 en',
  },
  merkelapp: [
    'merkelapp1', 'merkelapp2'
  ],
  eksempel: {
    nb: 'Eksempel test concept 3 nb',
    nn: 'Eksempel test concept 3 nn',
    en: 'Eksempel test concept 3 en',
  },
  fagområde: null,
  fagområdeKoder: null,
  omfang: {
    tekst: 'Omfang concept 3',
    uri: 'https://omfang.concept3.no'
  },
  tillattTerm: {
    nb: ['tillat-term1 nb', 'tillat-term2 nb'],
    nn: ['tillat-term1 nn', 'tillat-term2 nn'],
    en: ['tillat-term1 en', 'tillat-term2 en'],
  },
  frarådetTerm: {
    nb: ['frarådet-term1 nb', 'frarådet-term2 nb'],
    nn: ['frarådet-term1 nn', 'frarådet-term2 nn'],
    en: ['frarådet-term1 en', 'frarådet-term2 en'],
  },
  gyldigFom: '2199-01-01',
  gyldigTom: '2999-12-31',
  seOgså: [],
  internBegrepsRelasjon: [],
  internSeOgså: [],
  internErstattesAv: [],
  erstattesAv: [],
  statusURI: 'internal codes - REJECTED',
  assignedUser: null,
  begrepsRelasjon: [],
  interneFelt: null,
  abbreviatedLabel: 'TC3'
};


export const ALL_CONCEPTS = [CONCEPT_1, CONCEPT_2, CONCEPT_3];
