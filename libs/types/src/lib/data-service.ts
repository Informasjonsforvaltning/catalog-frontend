import { LocalizedStrings } from './localization';

export interface DataService extends DataServiceToBeCreated {
  id: string;
  catalogId: string;
}

export interface DataServiceToBeCreated {
  title: LocalizedStrings;
  description: LocalizedStrings;
  modified: string;
  status: string;
  endpointUrl: string;
}
