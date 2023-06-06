import { Status } from '@catalog-frontend/types';

export type PublishedFilterType = 'published' | 'notPublished';

export type SearchFilters = {
  published?: PublishedFilterType[];
  status?: Status[];
};

export interface SearchState {
  filters: SearchFilters;
}

export const DefaultSearchState = { filters: {} };
