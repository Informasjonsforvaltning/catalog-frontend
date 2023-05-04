import {SearchConceptResponse} from '@catalog-frontend/types';
import {ConceptState} from './state';

// add new action types here as needed: E.g. 'POPULATE' | 'UPDATE'
export type ACTION_TYPE = 'POPULATE' | 'SEARCH';

// add new payload types here as needed
export type ACTION_PAYLOAD = ConceptState & SearchConceptResponse;

export type ACTION = {type: ACTION_TYPE; payload: ACTION_PAYLOAD};

export const action = (type: ACTION_TYPE, payload: ACTION_PAYLOAD) => ({
  type,
  payload,
});
