import { LocalizedStrings } from './localization';

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
  modified?: string;
  status?: string;
  endpointUrl: string;
  endpointDescriptions?: string[];
  accessRights?: string;
  formats?: string[];
  keywords: LocalizedStrings;
  landingPage?: string;
  pages?: string[];
  license?: string;
  servesDataset?: string[];
  contactPoint?: DataServiceContactPoint;
  availability?: string;
  costs?: DataServiceCost[];
}

type DataServiceContactPoint = {
  email?: string;
  phone?: string;
  url?: string;
  organizationUnit?: string;
};

export type DataServiceCost = {
  value?: number;
  description?: LocalizedStrings;
  documentation?: string[];
  currency?: string;
};
