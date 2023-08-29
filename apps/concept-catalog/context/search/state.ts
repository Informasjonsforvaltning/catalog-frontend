import { AssignedUser, Status } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'unpublished';

export type InternalFieldFilterType = {
  id: string;
  value: string;
};
export type FilterTypes = 'published' | 'status' | 'assignedUser' | 'subject';

export interface SearchFilters {
  published?: PublishedFilterType[];
  status?: Status[];
  assignedUser?: AssignedUser;
  subject?: string[];
  internalFields?: Record<string, string[]>;
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
  },
};
