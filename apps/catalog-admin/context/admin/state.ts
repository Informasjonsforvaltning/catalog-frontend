import { CodeList } from '@catalog-frontend/types';

export interface AdminState {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string;
  updatedCodeLists?: CodeList[];
  orgName?: string;
}

export const DefaultAdminState = {
  backgroundColor: '#FFFFFF',
  fontColor: '#2D3741',
  logo: null,
  updatedCodeLists: [],
  orgName: null,
};
