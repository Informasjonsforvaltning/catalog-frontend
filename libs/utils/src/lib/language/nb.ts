/**
 * The array/tuple notation is used to specify a second value which is the aria-label for form control elements.
 */

export const nb = {
  allCatalogs: 'Alle kataloger',
  assigned: 'Tildelt',
  category: 'Kategori',
  changeHistory: 'Endringshistorikk',
  chooseLanguage: 'Velg språk',
  chooseOrganizaiton: 'Velg virksomhet',
  conceptStatus: 'Begrepsstatus',
  contactPage: 'Kontaktside',
  dataVillage: ['Datalandsbyen', 'Lenke til Datalandsbyen'],
  description: 'Beskrivelse',
  email: 'E-post',
  error: 'Feil',
  filter: 'Filtrer',
  fromAndIncluding: 'Fra og med',
  general: 'Generelt',
  harvestData: ['Høste data', 'Lenke til å høste data'],
  homepage: 'Hjemmeside',
  id: 'ID',
  linkToDataset: 'Lenke til datasett',
  linkToDatasets: 'Lenke til datasett',
  loading: 'Laster',
  manageCatalog: 'Administrere katalog',
  manageCatalogs: 'Administrere kataloger',
  name: 'Navn',
  nameAndConcept: 'Navn og begrep',
  no: 'Nei',
  noAccess: 'Ingen tilgang',
  notFound: 'Ikke funnet',
  notFoundPage: 'Fant ikke siden du lette etter.',
  ok: 'Ok',
  publicServices: 'Offentlige tjenester',
  registerData: ['Registrere data', 'Lenke til å registrere data'],
  save: 'Lagre',
  saveEdits: 'Lagre endringer',
  services: 'Tjenester',
  showLess: 'Vis færre',
  showMore: 'Vis flere',
  somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
  status: 'Status',
  subjectArea: 'Fagområde',
  suggestionForNewConcept: 'Forslag til nytt begrep',
  telephone: 'Telefon',
  title: 'Tittel',
  toAndIncluding: 'Til og med',
  unknown: 'Ukjent',
  yes: 'Ja',
  youHaveNoAccess: 'Det ser ikke ut til at du har tilgang til denne siden.',

  catalogType: {
    admin: 'Administrasjonsgrensesnitt',
    concept: 'Begrepskatalog',
    dataset: 'Datasettkatalogen',
    publicService: 'Offentlig tjenestekatalog',
    service: 'Tjenestekatalog',
  },

  language: {
    en: 'Engelsk',
    nb: 'Bokmål',
    nn: 'Nynorsk',
    no: 'Norsk',
  },

  auth: {
    login: 'Logg inn',
    logout: 'Logg ut',
    loggingIn: 'Logger inn...',
    loggingOut: 'Logger ut...',
  },

  search: {
    noHits: 'Ditt søk ga ingen treff',
    search: 'Søk',
    searchField: 'Søk i felt',
    searchForDataset: 'Søk etter datasettbeskrivelse',
    searchForPublicService: 'Søk etter offentlig tjeneste...',
    searchForService: 'Søk etter tjeneste...',
    searchForUsername: 'Søk etter brukernavn...',
    searchInCatalogs: ['Søk i Felles datakatalog', 'Lenke til søk i felles datakatalog'],
    sort: 'Sortering',

    fields: {
      alleFelter: 'Alle felter',
      alleTermer: 'Alle termer',
      anbefaltTerm: 'Anbefalt term',
      definisjon: 'Definisjon',
      frarådetTerm: 'Frarådet term',
      merknad: 'Merknad',
      tillattTerm: 'Tillatt term',
    },

    sortOptions: {
      LAST_UPDATED_FIRST: 'Sist endret først',
      LAST_UPDATED_LAST: 'Eldst først',
      RECOMMENDED_TERM_AÅ: 'Anbefalt term A-Å',
      RECOMMENDED_TERM_ÅA: 'Anbefalt term Å-A',
      RELEVANCE: 'Relevans',
    },
  },

  button: {
    addDataset: 'Legg til ny datasettbeskrivelse',
    addRelation: 'Legg til relasjon',
    addWithFormat: 'Legg til ny {text}',
    bin: 'Søppelkasse',
    cancel: 'Avbryt',
    close: 'Lukk',
    createConcept: 'Nytt begrep',
    delete: 'Slett',
    deleteWithFormat: 'Slett {text}',
    expandAll: 'Vis alle felter',
    harvestDataset: 'Høst spesifikasjon fra katalog',
    importConcept: 'Importer',
    importLogo: 'Importer logo',
    removeFilter: 'Fjern filter',
    removeFromCodeList: 'Fjern fra kodeliste',
    save: 'Lagre',
    send: 'Send inn',
  },

  dropdown: {
    addNew: 'Legg til ny',
    descriptionDataset: 'Beskrivelse av datasett',
    descriptionDatasetSerie: 'Beskrivelse av datasettserie',
    lastModified: 'Sist endret',
    statusSearch: 'Filtrer på status',
  },

  footer: {
    accessibility: 'Tilgjengelighetserklæring',
    cookies: 'Informasjonskapsler',
    digdirManagesNationalDataCatalog: 'Digitaliseringsdirektoratet forvalter Felles datakatalog.',
    privacyStatement: 'Personvernerklæring',
    termsOfUse: 'Bruksvilkår',
    twitter: 'Twitter',
  },

  header: {
    registerData: 'Registrere data',
    harvestData: 'Høste data',
    dataCommunity: 'Gå til Datalandsbyen',
    nationalDataCatalog: 'Gå til Felles datakatalog',
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
    codeListInUse: 'Kan ikke slette en kodeliste som er i bruk.',
    codeMustHaveName: 'En kode må ha et navn på bokmål.',
    deleteInternalField: 'Er du sikker på at du ønsker å slette feltet?',
    deleteUser: 'Er du sikker på at du vil slette brukernavnet?',
    fail: 'Oppdatering feilet.',
    noChanges: 'Ingen endringer funnet.',
    notValidFile: 'Innholdet i filen er ikke gyldig.',
    success: 'Oppdatering vellykket!',
  },

  catalogAdmin: {
    addUser: 'Legg til nytt brukernavn',
    backgroundColor: 'Bakgrunnsfarge',
    catalogAdmin: 'Administrasjonsgrensesnitt',
    codeList: 'Kodeliste',
    codeLists: 'Kodelister',
    colors: 'Farger',
    createCode: 'Opprett kode',
    createCodeList: 'Opprett kodeliste',
    customizeDesign: 'Tilpass design',
    deleteCodeList: 'Slett kodeliste',
    descriptionLogo: 'Beskrivelse av logo',
    design: 'Design',
    editCode: 'Rediger kode',
    editableFields: 'Editerbare felt',
    enableFilter: 'Aktiver filter',
    fontColor: 'Skriftfarge',
    general: 'Generelt',
    importCodeList: 'Importer kodeliste',
    internalFields: 'Interne felt',
    logo: 'Logo',
    noParentCode: 'Ingen overordnet kode',
    parentCode: 'Overordnet kode',
    preview: 'Forhåndsvisning',
    searchFieldCodeList: 'Søkefelt kodeliste',
    searchForCodeList: 'Søk etter kodeliste...',
    username: 'Brukernavn',
    chooseCodeList: 'Velg kodeliste',
    fieldNameDescription: 'Navn på felt',
    fieldTypeDescription: 'Type felt',

    description: {
      conceptCatalog: 'Her kan du administrere innstillinger og innhold for begrepskatalogen.',
      general: 'Her kan du administrere innstillinger og innhold på tvers av katalogene.',
    },

    manage: {
      codeList: 'Her kan du administrere kodelistene som brukes av interne og editerbare felt.',
      conceptCatalog: 'Administrere begrepskatalog',
      design: 'Administrer organisasjonsspesifikt design',
      editableFields: 'Her kan du velge kodelister for felt som publiseres eksternt, som fagområde.',
      enableFilter: 'Gjør det mulig å filtrere på feltet i søk i intern begrepskatalog.',
      internalFields: 'Her kan du legge til, endre og fjerne interne felt som er spesifikke for din virksomhet.',
      username: 'Administrer brukernavn, som brukes i felt som Tildelt',
    },

    designHelpText: {
      colors:
        'Her legger du inn virksomhetens bakgrunnsfarge og skriftfarge. Fargen må være oppgitt som HEX-kode på formen #FFF eller #FFFFFF. Husk at kontrasten til bakgrunnen må være 3:1 for å oppfylle WCAG-kravet.',
      logo: 'Her laster du opp virksomhetens logo. Tillatte filtyper er SVG og PNG.',
      logoDescription: 'Beskrivelse av virksomhetens logo. Eksempel: "Logo digdir"',
    },

    codeName: {
      confirmDelete: 'Er du sikker på at du vil slette dette feltet?',
      en: 'Navn (engelsk)',
      nb: 'Navn (bokmål)',
      nn: 'Navn (nynorsk)',
    },

    create: {
      newInternalField: 'Opprett nytt internt felt',
    },
  },

  concept: {
    abbreviation: 'Forkortelse',
    allowedTerm: 'Tillatt term',
    associativeRelation: 'Assosiativ relasjon',
    concept: 'Begrep',
    confirmDelete: 'Er du sikker du ønsker å slette begrepet?',
    contactInformation: 'Kontaktinformasjon for eksterne',
    created: 'Opprettet',
    createdBy: 'Opprettet av',
    definition: 'Definisjon',
    divisionCriterion: 'Inndelingskriterium',
    example: 'Eksempel',
    formFieldLabel: '{fieldType} på {lang}',
    generalizes: 'Underordnet',
    genericRelation: 'Generisk relasjon',
    hasPart: 'Inngår i',
    internalField: 'Interne felt',
    isPartOf: 'Er del av',
    isReplacedBy: 'Erstattes av',
    label: 'Merkelapp',
    lastUpdated: 'Sist oppdatert',
    noName: 'Uten navn',
    notRecommendedTerm: 'Frarådet term',
    note: 'Merknad',
    partitiveRelation: 'Partitiv relasjon',
    preferredTerm: 'Anbefalt term',
    publicDefinition: 'Definisjon for allmennheten',
    relatedConcepts: 'Relaterte begreper ({conceptCount})',
    relationToSource: 'Forhold til kilde',
    replacedBy: 'Erstattet av',
    seeAlso: 'Se også',
    selfDefined: 'Egendefinert',
    source: 'Kilde',
    specialistDefinition: 'Definisjon for spesialister',
    specializes: 'Overordnet',
    suggestChanges: 'Foreslå endring',
    validPeriod: 'Gyldighetsperiode',
    valueDomain: 'Verdiområde',
    version: 'Versjon',
    versions: 'Versjoner',
  },

  validity: {
    expired: 'Utgått',
    willBeValid: 'blir gyldig',
  },

  changeRequest: {
    accept: 'Godta',
    alertInformation:
      'Bare et utvalg av feltene til et begrep støttes av dette skjemaet. Det er bare feltene du redigerer som til slutt gjør endringer på begrepet, resten av begrepet forblir uendret.',
    changeRequest: 'Endringsforslag',
    edit: 'Rediger',
    editSources: 'Rediger kilder',
    editTitle: 'Rediger tittel',
    existingContent: 'Eksisterende innhold',
    existingValue: 'Eksisterende {fieldType} på {lang}',
    newChangeRequest: 'Nytt endringsforslag',
    noChangeRequestsFound: 'Her var det ingen endringsforslag',
    noHits: 'Ingen treff!',
    noName: 'Uten navn',
    noValue: 'Ingen verdi',
    proposedChange: 'Forslag til ny {fieldType} på {lang}',
    reject: 'Avslå',
    seeChangeRequests: 'Se alle endringsforslag',
    sourceLink: 'Lenke til kilde',
    sourceTitle: 'Tittel på kilde',

    status: {
      accepted: 'Godtatt',
      open: 'Åpen',
      rejected: 'Avvist',
    },
  },

  comment: {
    comments: 'Kommentarer',
    confirmDelete: 'Er du sikker du ønsker å slette kommentaren?',
    deleteComment: 'Slett kommentar',
    editComment: 'Rediger kommentar',
    saveComment: 'Lagre kommentar',
  },

  codeList: {
    confirmDelete: 'Er du sikker på at du ønsker å slette kodelisten?',
  },

  history: {
    noChanges: 'Ingen endringer er gjort',
  },

  publicationState: {
    confirmPublish: 'Er du sikker på at du vil publisere begrepet?',
    description: 'Publiseringstilstand forteller om et begrep er publisert i Felles Datakatalog eller ikke.',
    published: 'Publisert',
    publishedInFDK: 'Publisert i Felles Datakatalog',
    state: 'Publiseringstilstand',
    unpublished: 'Ikke publisert',
    unpublishedInFDK: 'Ikke publisert i Felles Datakatalog',
  },

  validation: {
    invalidValue: 'Ugyldig verdi',
    invalidEmail: 'Ugyldig epostadresse',
    invalidUrl: 'Ugyldig nettaddresse',
    invalidTlf: 'Ugyldig telefonnummer',
  },

  serviceCatalog: {
    confirmPublish: 'Er du sikker på at du vil publisere tjenesten?',
    confirmUnpublish: 'Er du sikker på at du vil avpublisere tjenesten?',
    contactPoint: 'Kontaktpunkt',
    editPublicService: 'Rediger offentlig tjeneste',
    editService: 'Rediger tjeneste',
    infoAboutService: 'Informasjon om tjenesten',
    produces: 'Produserer',
    searchHitsTitle: 'Listevisning',
    serviceStatus: 'Tjenestestatus',

    form: {
      confirmDelete: 'Er du sikker på at du vil slette tjenesten?',
      delete: 'Slett tjeneste',
      descriptionProduces:
        'Egenskapen brukes til å referere til en eller flere instanser av tjenesteresultat som beskriver resultat av tjenesten.',
      descriptionSubtitle: 'Beskrivelsen skal være kortfattet og formålet med tjenesten bør fremgå.',
      homepageDescription: 'Egenskapen brukes til å referere til hjemmesiden til tjenesten.',
      homepageLabel: 'Lenke til hjemmeside',
      new: 'Opprett ny tjeneste',
      newPublic: 'Opprett ny offentlig tjeneste',
      save: 'Lagre tjeneste',
      titleLabel: 'Tekst på bokmål',
      titleSubtitle: 'Navnet skal være kortfattet, kunne stå alene og gi mening.',
    },
  },
};
