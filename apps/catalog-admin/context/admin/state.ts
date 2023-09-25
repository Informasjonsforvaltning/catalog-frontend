import { CodeList } from '@catalog-frontend/types';

export interface AdminState {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string;
  updatedCodeLists?: CodeList[];
  showUserEditor?: boolean;
}

export const DefaultAdminState = {
  backgroundColor: '#FFFFFF',
  fontColor: '#2D3741',
  logo: null,
  updatedCodeLists: [],
  showUserEditor: false,
};
