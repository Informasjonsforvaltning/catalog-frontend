/**
 * The array/tuple notation is used to specify a second value which is the aria-label for form control elements.
 */

export const nb = {
  loading: 'Laster',
  general: 'Generelt',
  noAccess: 'Ingen tilgang',
  youHaveNoAccess: 'Det ser ut at du ikke har tilgang.',
  notFound: 'Ikke funnet',
  didNotFoundPage: 'Fant ikke siden du lette etter.',
  error: 'Feil',
  somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
  allCatalogs: 'Alle kataloger',
  catalogType: { concept: 'Begrepskatalog', dataset: 'Datasettkatalogen' },
  dataVillage: ['Datalandsbyen', 'Lenke til Datalandsbyen'],
  harvestData: ['Høste data', 'Lenke til å høste data'],
  registerData: ['Registrere data', 'Lenke til å registrere data'],
  linkToDataset: 'Lenke til datasett',
  linkToDatasets: 'Lenke til datasett',
  chooseLanguage: 'Velg språk',
  subjectArea: 'Fagområde',
  conceptStatus: 'Begrepsstatus',
  assigned: 'Tildelt',

  nameAndConcept: 'Navn og begrep',
  save: 'Lagre',

  auth: {
    login: 'Logg inn',
    logout: 'Logg ut',
    loggingIn: 'Logger inn...',
    loggingOut: 'Logger ut...',
  },

  search: {
    searchInAllFields: 'Søk i alle felt',
    searchForDataset: 'Søk etter datasettbeskrivelse',
    sort: 'Sortering',
    searchField: 'Søk i felt',
    searchInCatalogs: ['Søk i Felles datakatalog', 'Lenke til søk i felles datakatalog'],
    noHits: 'Ditt søk ga ingen treff',

    fields: {
      alleFelter: 'Alle felter',
      alleTermer: 'Alle termer',
      anbefaltTerm: 'Anbefalt term',
      frarådetTerm: 'Frarådet term',
      tillattTerm: 'Tillatt term',
      definisjon: 'Definisjon',
      merknad: 'Merknad',
    },

    sortOptions: {
      LAST_UPDATED_FIRST: 'Sist endret først',
      LAST_UPDATED_LAST: 'Eldst først',
      RECOMMENDED_TERM_AÅ: 'Anbefalt term A-Å',
      RECOMMENDED_TERM_ÅA: 'Anbefalt term Å-A',
    },
  },

  button: {
    addDataset: 'Legg til ny datasettbeskrivelse',
    createConcept: 'Nytt begrep',
    importConcept: 'Importer',
    delete: 'Slett',
    expandAll: 'Vis alle felter',
    harvestDataset: 'Høst spesifikasjon fra katalog',
    importLogo: 'Importer logo',
    bin: 'Søppelkasse',
    removeFilter: 'Fjern filter',
  },

  dropdown: {
    lastModified: 'Sist endret',
    statusSearch: 'Filtrer på status',
    addNew: 'Legg til ny',
    descriptionDataset: 'Beskrivelse av datasett',
    descriptionDatasetSerie: 'Beskrivelse av datasettserie',
  },

  footer: {
    digdirManagesNationalDataCatalog: 'Digitaliseringsdirektoratet forvalter Felles datakatalog.',
    termsOfUse: 'Bruksvilkår',
    privacyStatement: 'Personvernerklæring',
    cookies: 'Informasjonskapsler',
    accessibility: 'Tilgjengelighetserklæring',
    twitter: 'Twitter',
  },

  header: {
    registerData: 'Registrere data',
    harvestData: 'Høste data',
    dataCommunity: 'Datalandsbyen',
    nationalDataCatalog: 'Felles datakatalog',
  },

  tag: {
    all: 'Alle',
    approve: 'Godkjent',
    draft: 'Utkast',
    publish: 'Publisert',
  },

  searchHit: {
    lastEdited: 'Sist endret',
  },
  catalogAdmin: {
    internalFields: 'Interne felt',
    codeList: 'Kodeliste',
    fontColor: 'Skriftfarge',
    backgroundColor: 'Bakgrunnsfarge',
    descriptionLogo: 'Beskrivelse av logo',
    logo: 'Logo',
    preview: 'Forhåndsvisning',
    general: 'Generelt',
    customizeDesign: 'Tilpass design',
    description: {
      general:
        'Oversikt over beskrivelser av datasett, begrep, apier og informasjonmodeller. Innholdet blir levert av ulike virksomheter, offentlige og private.',
      conceptCatalog:
        'Oversikt over beskrivelser av datasett, begrep, apier og informasjonmodeller. Innholdet blir levert av ulike virksomheter, offentlige og private.',
    },
    manage: {
      internalFields: 'Administrer interne felt',
      codeList: 'Administrer kodeliste',
    },
  },

  concept: {
    replacedBy: 'Erstattet av',
    note: 'Merknad',
    example: 'Eksempel',
    simplifiedExplanation: 'Folkelig forklaring',
    legalExplanation: 'Rettslig forklaring',
    allowedTerm: 'Tillatt term',
    notRecommendedTerm: 'Frarådet term',
    abbreviation: 'Forkortelse',
    valueDomain: 'Verdiområde',
    internalField: 'Interne felt',
    confirmDelete: 'Er du sikker du ønsker å slette begrepet?',
    noName: 'Uten navn',
  },

  comment: {
    comments: 'Kommentarer',
    confirmDelete: 'Er du sikker du ønsker å slette kommentaren?',
    editComment: 'Rediger kommentar',
    deleteComment: 'Slett kommentar',
    saveComment: 'Lagre kommentar',
  },

  history: {
    noChanges: 'Ingen endringer er gjort',
  },

  status: {
    draft: 'Utkast',
    approved: 'Godkjent',
    hearing: 'Høring',
  },

  publicationState: {
    state: 'Publiseringstilstand',
    description: 'Publiseringstilstand forteller om et begrep er publisert i Felles Datakatalog eller ikke.',
    published: 'Publisert',
    publishedInFDK: 'Publisert i Felles Datakatalog',
    unpublished: 'Ikke publisert',
  },
};
