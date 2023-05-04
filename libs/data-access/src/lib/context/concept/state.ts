import {Concept, ConceptHitPageProps} from '@catalog-frontend/types';

export interface ConceptState {
  accessToken: string;
  catalogId: string;
  concepts: Concept[];
  page: ConceptHitPageProps;
}

export const DefaultConceptState = {
  accessToken: '',
  catalogId: '',
  concepts: [],
  page: {
    currentPage: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  },
};
