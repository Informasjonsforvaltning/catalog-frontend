import { CodeList } from '@catalog-frontend/types';

export interface AdminState {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string;
  updatedCodeLists?: CodeList[];
}

export const DefaultAdminState = {
  backgroundColor: null,
  fontColor: null,
  logo: null,
  updatedCodeLists: [],
};
