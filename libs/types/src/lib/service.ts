import { LocalizedStrings } from './localization';

export interface Service extends ServiceToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
}

export interface ServiceToBeCreated {
  title: LocalizedStrings;
  description?: LocalizedStrings;
  produces?: Output[];
  contactPoints?: ContactPoint[];
  homepage?: string;
  status?: string;
}

export interface Output {
  identifier: string;
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  language?: string[];
}

export interface ContactPoint {
  category?: LocalizedStrings;
  email?: string;
  telephone?: string;
  contactPage?: string;
}
