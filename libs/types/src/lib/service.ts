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
  homepage?: string;
  produces?: Output[];
  requiredEvidence?: RequiredEvidence[];
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

export interface RequiredEvidence {
  title: LocalizedStrings;
  description: LocalizedStrings;
  validityDuration?: string;
  language?: string[];
  identifier?: string;
  page?: string;
  type?: string;
}

export interface ContactPoint {
  category?: LocalizedStrings;
  email?: string;
  telephone?: string;
  contactPage?: string;
}
