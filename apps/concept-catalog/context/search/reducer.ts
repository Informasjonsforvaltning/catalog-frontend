import { ACTION } from './action';
import { type SearchState } from './state';
import { produce } from 'immer';

export const reducer = produce((state: SearchState, action: ACTION): SearchState => {
  switch (action.type) {
    case 'POPULATE': {
      state = action.payload;
      return state;
    }
    case 'SET_PUBLICATION_STATE': {
      state.filters.published = action.payload.filters?.published;
      return state;
    }
    case 'SET_CONCEPT_STATUS': {
      state.filters.status = action.payload.filters?.status;
      return state;
    }
    case 'SET_SUBJECTS': {
      state.filters.subject = action.payload.filters?.subject;
      return state;
    }
    case 'SET_NAME_AND_CONCEPT': {
      // TODO: implement when backend is ready
      return state;
    }
    case 'SET_ASSIGNED_USER': {
      state.filters.assignedUser = action.payload.filters?.assignedUser;
      return state;
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
});
