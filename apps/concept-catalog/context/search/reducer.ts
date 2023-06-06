import { ACTION } from './action';
import { type SearchState } from './state';
import { produce } from 'immer';

export const reducer = produce((state: SearchState, action: ACTION): SearchState => {
  switch (action.type) {
    case 'POPULATE': {
      state = action.payload;
      return state;
    }
    case 'SET_PUBLISHED': {
      state.filters.published = action.payload.filters?.published;
      return state;
    }
    case 'SET_STATUS': {
      state.filters.status = action.payload.filters?.status;
      return state;
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
});
