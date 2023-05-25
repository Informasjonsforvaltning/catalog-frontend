/**
 * The array/tuple notation is used to specify a second value which is the aria-label for form control elements.
 */

export const nb = {
  loading: 'Laster',
  general: 'Generelt',
  noAccess: 'Ingen tilgang.',
  somethingWentWrong: 'Beklager, noe gikk galt. Prøv på nytt litt senere.',
  allCatalogs: 'Alle kataloger',
  catalogType: { concept: 'Begrepskatalog', dataset: 'Datasettkatalogen' },
  dataVillage: ['Datalandsbyen', 'Lenke til Datalandsbyen'],
  harvestData: ['Høste data', 'Lenke til å høste data'],
  registerData: ['Registrere data', 'Lenke til å registrere data'],
  linkToDataset: 'Lenke til datasett',
  linkToDatasets: 'Lenke til datasett',

  search: {
    searchInAllFields: 'Søk i alle felt',
    searchForDataset: 'Søk etter datasettbeskrivelse',
    alphabeticalSort: 'Alfabetisk sortering',
    dateSort: 'Sortering på dato',
    searchField: 'Søk i felt',
    searchInCatalogs: ['Søk i Felles datakatalog', 'Lenke til søk i felles datakatalog'],
    noResults: 'Ingen resultater',

    fields: {
      alleFelter: 'Alle felter',
      anbefaltTerm: 'Anbefalt term',
      frarådetTerm: 'Frarådet term',
      tillattTerm: 'Tillatt term',
      definisjon: 'Definisjon',
      merknad: 'Merknad',
    },

    sortOptions: {
      ASC: 'Stigende',
      DESC: 'Synkende',
    },

    dateSortOptions: {
      SIST_ENDRET: 'Sist endret',
      ELDST: 'Eldst',
    },
  },

  button: {
    addDataset: 'Legg til ny datasettbeskrivelse',
    createConcept: 'Nytt begrep',
    importConcept: 'Importer',
    delete: 'Slett',
    expandAll: 'Vis alle felter',
    harvestDataset: 'Høst spesifikasjon fra katalog',
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
    logout: 'Logg ut',
  },

  tag: {
    all: 'Alle',
    approve: 'Godkjent',
    draft: 'Utkast',
    publish: 'Publisert',
  },

  searchHit: {
    lastEdited: 'Sist endret',
    publishedInFDK: 'Publisert i Felles Datakatalog',
  },
  catalogAdmin: {
    internalFields: 'Interne felt',
    codeList: 'Kodeliste',
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
};
