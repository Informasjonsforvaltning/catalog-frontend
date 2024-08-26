export interface ServiceCatalogItem {
  catalogId: string;
  serviceCount?: number;
  publicServiceCount?: number;
}

export interface ServiceCatalogs {
  serviceCatalogs: { catalogId: string; serviceCount: number }[];
  publicServiceCatalogs: { catalogId: string; publicServiceCount: number }[];
}

export interface DatasetCatalog {
  id: string;
  uri: string;
  title: { nb: string };
  publisher: {
    uri: string;
    id: string;
    name: string;
  };
  datasetCount: number;
  hasPublishedDataSource: boolean;
}

export interface DataServiceCatalog {
  id: string;
  dataServiceCount: number;
}

export interface ConceptCatalog {
  id: string;
  antallBegrep: number;
}

export interface PublicServiceCatalog {
  catalogId: string;
  publicServiceCount: number;
}

export interface ServiceCatalog {
  catalogId: string;
  serviceCount: number;
}

export interface RecordOfProcessingActivities {
  organizationId: string;
  recordCount: number;
}
