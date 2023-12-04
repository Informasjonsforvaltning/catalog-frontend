import { Code, CodeList } from '@catalog-frontend/types';

export interface AdminState {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string | null | undefined;
  updatedCodeLists?: CodeList[];
  showUserEditor?: boolean;
  showInternalFieldEditor?: boolean;
  showCodeListEditor?: boolean;
  updatedCodes?: Record<string, Code[]>;
}

export const DefaultAdminState = {
  backgroundColor: '#FFFFFF',
  fontColor: '#2D3741',
  logo: null,
  updatedCodeLists: [],
  showUserEditor: false,
  showInternalFieldEditor: false,
  showCodeListEditor: false,
  updatedCodes: null,
};
