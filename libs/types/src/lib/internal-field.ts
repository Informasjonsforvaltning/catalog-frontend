import { LocalizedStrings } from './localization';

export type FieldType = 'text_short' | 'text_long' | 'boolean' | 'code_list' | 'user_list';

export type FieldLocation = 'main_column' | 'right_column';

export interface Fields {
  internal: InternalField[];
  editable: EditableFields;
}

export interface InternalField extends InternalFieldTemplate {
  id: string;
}

export interface InternalFieldTemplate {
  catalogId?: string;
  label?: LocalizedStrings;
  description?: LocalizedStrings;
  type?: FieldType;
  enableFilter?: boolean;
  location?: FieldLocation;
  codeListId?: string;
}

export interface EditableFields {
  catalogId: string;
  domainCodeListId: string;
}

export interface FieldsResult {
  editable: EditableFields;
  internal: InternalField[];
}
