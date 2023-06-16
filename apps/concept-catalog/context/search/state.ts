import { Status } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'unpublished';
export type StatusFilterType = Status;

export interface SearchFilters {
  published?: PublishedFilterType[];
  status?: StatusFilterType[];
}

export interface SearchState {
  filters: SearchFilters;
}

export const DefaultSearchState = { filters: {} };
