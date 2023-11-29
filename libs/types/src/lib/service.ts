import { MultiLanguageText } from './language';

export interface Service extends ServiceToBeCreated {
  id: string;
  published: boolean;
}

export interface ServiceToBeCreated {
  title: MultiLanguageText;
  description?: MultiLanguageText;
}
