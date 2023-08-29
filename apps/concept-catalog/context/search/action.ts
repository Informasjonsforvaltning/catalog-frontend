import { SearchState } from './state';

// add new action types here as needed: E.g. 'POPULATE' | 'UPDATE'
export type ACTION_TYPE =
  | 'POPULATE'
  | 'SET_PUBLICATION_STATE_FILTER'
  | 'SET_CONCEPT_STATUS_FILTER'
  | 'SET_ASSIGNED_USER_FILTER'
  | 'SET_SUBJECTS_FILTER'
  | 'SET_INTERNAL_FIELDS_FILTER';

// add new payload types here as needed
export type ACTION_PAYLOAD = SearchState;

export type ACTION = { type: ACTION_TYPE; payload: ACTION_PAYLOAD };

export const action = (type: ACTION_TYPE, payload: ACTION_PAYLOAD) => ({
  type,
  payload,
});
