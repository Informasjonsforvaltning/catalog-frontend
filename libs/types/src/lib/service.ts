import { MultiLanguageText } from './language';

export interface Service {
  id: string;
  catalogId: string;
  title: MultiLanguageText;
  description?: MultiLanguageText;
}
