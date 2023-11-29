import { MultiLanguageText } from './language';

export interface Service extends ServiceToBeCreated {
  id: string;
}

export interface ServiceToBeCreated {
  catalogId: string;
  title: MultiLanguageText;
  description?: MultiLanguageText;
  published?: boolean;
}
