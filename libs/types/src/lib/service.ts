import { MultiLanguageText } from './language';

export interface Service extends ServiceToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
}

export interface ServiceToBeCreated {
  title: MultiLanguageText;
  description?: MultiLanguageText;
  produces?: Output[];
  contactPoints?: ContactPoint[];
  homepage?: string;
  status?: string;
}

export interface Output {
  identifier: string;
  title?: MultiLanguageText;
  description?: MultiLanguageText;
  language?: string[];
}

export interface ContactPoint {
  category?: MultiLanguageText;
  email?: string;
  telephone?: string;
  contactPage?: string;
}
