import { MultiLanguageText } from './language';

export interface Service extends ServiceToBeCreated {
  id: string;
  published: boolean;
  produces: Output[];
}

export interface ServiceToBeCreated {
  title: MultiLanguageText;
  description?: MultiLanguageText;
  produces?: Output[];
  contactPoints?: ContactPoint[];
}

export interface Output {
  identifier: string;
  title?: MultiLanguageText;
  description?: MultiLanguageText;
  language?: string[];
}

export interface ContactPoint {
  category: MultiLanguageText;
  email: string;
  telephone: string;
  contactPage: string;
}
