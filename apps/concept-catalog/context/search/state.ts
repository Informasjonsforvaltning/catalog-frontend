import { AssignedUser, Status } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'unpublished';

export interface SearchFilters {
  published?: PublishedFilterType[];
  status?: Status[];
  assignedUser?: AssignedUser;
  subject?: string[];
}

export interface SearchState {
  filters: SearchFilters;
}

export const DefaultSearchState = { filters: {} };
