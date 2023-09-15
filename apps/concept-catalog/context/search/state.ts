import { AssignedUser } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'unpublished';
export type FilterType = 'published' | 'status' | 'assignedUser' | 'subject' | 'internalFields' | 'label';

export type InternalFieldFilterType = {
  id: string;
  value: string;
};

export interface SearchFilters {
  published?: PublishedFilterType[];
  status?: string[];
  assignedUser?: AssignedUser;
  subject?: string[];
  internalFields?: Record<string, string[]>;
  label?: string[];
}

export interface SearchState {
  filters: SearchFilters;
}

export const DefaultSearchState: SearchState = {
  filters: {
    published: [],
    status: [],
    assignedUser: null,
    subject: [],
    internalFields: null,
  },
};
