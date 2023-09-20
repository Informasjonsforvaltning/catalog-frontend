/**
 * The array/tuple notation is used to specify a second value which is the aria-label for form control elements.
 */

export const nb = {
  yes: 'Ja',
  no: 'Nei',
  loading: 'Laster',
  general: 'Generelt',
  noAccess: 'Ingen tilgang',
  youHaveNoAccess: 'Det ser ikke ut til at du har tilgang til denne siden.',
  notFound: 'Ikke funnet',
  didNotFoundPage: 'Fant ikke siden du lette etter.',
  error: 'Feil',
  somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
  allCatalogs: 'Alle kataloger',
  chooseOrganizaiton: 'Velg virksomhet',
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
  ok: 'Ok',
  description: 'Beskrivelse',
  name: 'Navn',
  manageCatalog: 'Administrere katalog',
  fromAndIncluding: 'Fra og med',
  toAndIncluding: 'Til og med',

  language: {
    nb: 'Bokmål',
    nn: 'Nynorsk',
    en: 'Engelsk',
    no: 'Norsk',
  },

  nameAndConcept: 'Navn og begrep',
  save: 'Lagre',
  saveEdits: 'Lagre endringer',
  suggestionForNewConcept: 'Forslag til nytt begrep',

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
    save: 'Lagre',
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
    underRevision: 'Under revidering',
  },

  alert: {
    success: 'Oppdatering vellykket!',
    fail: 'Oppdatering feilet.',
    notValidFile: 'Innholdet i filet er ikke gyldig.',
  },

  catalogAdmin: {
    catalogAdmin: 'Administrasjonsgrensesnitt',
    internalFields: 'Interne felt',
    editableFields: 'Editerbare felt',
    codeList: 'Kodeliste',
    codeLists: 'Kodelister',
    fontColor: 'Skriftfarge',
    backgroundColor: 'Bakgrunnsfarge',
    descriptionLogo: 'Beskrivelse av logo',
    colors: 'Farger',
    logo: 'Logo',
    preview: 'Forhåndsvisning',
    general: 'Generelt',
    customizeDesign: 'Tilpass design',
    userList: 'Brukerliste',
    design: 'Design',
    addUser: 'Legg til ny bruker',
    parentCode: 'Overordnet kode',
    noParentCode: 'Ingen overordnet kode',
    editCode: 'Rediger kode',
    createCode: 'Opprett kode',
    deleteCodeList: 'Slett kodeliste',
    importCodeList: 'Importer kodeliste',
    createCodeList: 'Opprett kodeliste',
    searchForCodeList: 'Søk etter kodeliste...',
    searchFieldCodeList: 'Søkefelt kodeliste',
    enableFilter: 'Aktiver filter',
    description: {
      general: 'Her kan du administrere innstillinger og innhold på tvers av katalogene.',
      conceptCatalog: 'Her kan du administrere innstillinger og innhold for begrepskatalogen.',
    },
    manage: {
      internalFields: 'Her kan du legge til, endre og fjerne interne felt som er spesifikke for din virksomhet.',
      editableFields: 'Her kan du velge kodelister for felt som publiseres eksternt, som fagområde.',
      codeList: 'Her kan du administrere kodelistene som brukes av interne og editerbare felt.',
      design: 'Administrer organisasjonsspesifikt design',
      userList: 'Administrer brukerliste',
      catalogAdmin: 'Administrere begrepskatalog',
      enableFilter: 'Gjør det mulig å filtrere på feltet i søk i intern begrepskatalog.',
    },
    designHelpText: {
      logo: 'Her laster du opp virksomhetens logo. Tillatte filtyper er SVG og PNG.',
      logoDescription: 'Beskrivelse av virksomhetens logo. Eksempel: "Logo digdir"',
      colors:
        'Her legger du inn virksomhetens bakgrunnsfarge og skriftfarge. Fargen må være oppgitt som HEX-kode på formen #FFF eller #FFFFFF. Husk at kontrasten til bakgrunnen må være 3:1 for å oppfylle WCAG-kravet.',
    },
    codeName: {
      en: 'Navn (engelsk)',
      nn: 'Navn (nynorsk)',
      nb: 'Navn (bokmål)',
      confirmDelete: 'Er du sikker på at du vil slette dette feltet?',
    },
    create: {
      newInternalField: 'Opprett nytt internt felt',
    },
    fieldNameDescription: 'Navn på felt',
    fieldTypeDescription: 'Type felt',
    chooseCodeList: 'Velg kodeliste',
  },

  concept: {
    id: 'ID',
    replacedBy: 'Erstattet av',
    createdBy: 'Opprettet av',
    created: 'Opprettet',
    lastUpdated: 'Sist oppdatert',
    note: 'Merknad',
    example: 'Eksempel',
    publicDefinition: 'Folkelig forklaring',
    specialistDefinition: 'Rettslig forklaring',
    allowedTerm: 'Tillatt term',
    notRecommendedTerm: 'Frarådet term',
    abbreviation: 'Forkortelse',
    valueDomain: 'Verdiområde',
    internalField: 'Interne felt',
    confirmDelete: 'Er du sikker du ønsker å slette begrepet?',
    noName: 'Uten navn',
    version: 'Versjon',
    validPeriod: 'Gyldighetsperiode',
    label: 'Merkelapp',
    source: 'Kilde',
  },

  changeRequest: {
    changeRequest: 'Endringsforslag',
    seeChangeRequests: 'Se alle endringsforslag',
  },

  comment: {
    comments: 'Kommentarer',
    confirmDelete: 'Er du sikker du ønsker å slette kommentaren?',
    editComment: 'Rediger kommentar',
    deleteComment: 'Slett kommentar',
    saveComment: 'Lagre kommentar',
  },

  codeList: {
    confirmDelete: 'Er du sikker på at du ønsker å slette kodelisten?',
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
