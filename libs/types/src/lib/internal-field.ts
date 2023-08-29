import { MultiLanguageText } from './language';

export type FieldType = 'text_short' | 'text_long' | 'boolean' | 'code_list' | 'user_list';

export type FieldLocation = 'main_column' | 'right_column';

export interface InternalField {
  id?: string;
  catalogId?: string;
  label?: MultiLanguageText;
  description?: MultiLanguageText;
  type: FieldType;
  enableFilter?: boolean;
  location?: FieldLocation;
  codeListId?: string;
}

export interface EditableFields {
  catalogId: string;
  domainCodeListId: string;
}

export interface SelectOption {
  label: string;
  value: FieldType;
}

export interface FieldsResult {
  editable: EditableFields;
  internal: InternalField[];
}
