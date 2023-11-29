import { MultiLanguageText } from './language';

export interface Service extends ServiceToBeCreated {
  id: string;
  catalogId: string;
}

export interface ServiceToBeCreated {
  title: MultiLanguageText;
  description?: MultiLanguageText;
}
