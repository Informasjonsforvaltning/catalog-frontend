import { MultiLanguageText } from './types';

export type FieldType = 'text_short' | 'text_long' | 'boolean' | 'code_list';

type FieldLocation = 'main_column' | 'right_column';

export interface Field {
  id?: string;
  catalogId?: string;
  label?: MultiLanguageText;
  description?: MultiLanguageText;
  type: FieldType;
  location?: FieldLocation;
  codeListId?: string;
}

export interface SelectOption {
  label: string;
  value: FieldType;
}

export interface EditableField {
  catalogId?: string;
  domainCodeListId?: string;
}
