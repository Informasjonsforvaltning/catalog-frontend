import { SearchState } from './state';

// add new action types here as needed: E.g. 'POPULATE' | 'UPDATE'
export type ACTION_TYPE =
  | 'POPULATE'
  | 'SET_PUBLICATION_STATE'
  | 'SET_CONCEPT_STATUS'
  | 'SET_NAME_AND_CONCEPT'
  | 'SET_ASSIGNED_USER';

// add new payload types here as needed
export type ACTION_PAYLOAD = SearchState;

export type ACTION = { type: ACTION_TYPE; payload: ACTION_PAYLOAD };

export const action = (type: ACTION_TYPE, payload: ACTION_PAYLOAD) => ({
  type,
  payload,
});
