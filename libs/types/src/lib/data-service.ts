import { LocalizedStrings } from "./localization";

export interface DataService extends DataServiceToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
  publishedDate: string;
  uri: string;
}

export interface DataServiceToBeCreated {
  title: LocalizedStrings;
  description: LocalizedStrings;
  status?: string;
  endpointUrl: string;
  endpointDescriptions?: string[];
  accessRights?: string;
  formats?: string[];
  keywords: LocalizedStrings;
  version?: string;
  landingPage?: string;
  pages?: string[];
  license?: string;
  servesDataset?: string[];
  contactPoint?: DataServiceContactPoint;
  availability?: string;
  costs?: DataServiceCost[];
}

type DataServiceContactPoint = {
  name?: LocalizedStrings;
  email?: string;
  phone?: string;
  url?: string;
};

export type DataServiceCost = {
  value?: number;
  description?: LocalizedStrings;
  documentation?: string[];
  currency?: string;
};

export type DataServicesPageSettings = {
  search: string | null;
  sort: string | null;
  page: number | null;
  filter: {
    status: string[] | null;
    pubState: string[] | null;
  };
};
