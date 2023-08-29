import { AssignedUser, Status } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'unpublished';

export type InternalFieldFilterType = {
  id: string;
  value: string;
};

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

export const DefaultSearchState = { filters: {} };
