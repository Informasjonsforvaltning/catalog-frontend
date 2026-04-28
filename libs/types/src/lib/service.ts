import { LocalizedStrings } from "./localization";

export interface Service extends ServiceToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
}

export interface ServiceToBeCreated {
  contactPoints?: ContactPoint[];
  dctType?: string[];
  description?: LocalizedStrings;
  evidence?: Evidence[];
  homepage?: string;
  losTheme?: string[];
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

export interface Evidence {
  identifier: string;
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  language?: string[];
  relatedDocumentation?: string[];
  dataset?: string[];
}

export interface ContactPoint {
  category?: LocalizedStrings;
  email?: string;
  telephone?: string;
  contactPage?: string;
}
