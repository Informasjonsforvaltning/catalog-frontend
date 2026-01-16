import { LocalizedStrings } from "./localization";

export interface Service extends ServiceToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
}

export interface ServiceToBeCreated {
  contactPoints?: ContactPoint[];
  description?: LocalizedStrings;
  homepage?: string;
  produces?: Output[];
  spatial?: string[];
  status?: string;
  subject?: string[];
  title: LocalizedStrings;
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
