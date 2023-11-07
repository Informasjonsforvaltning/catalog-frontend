import { ACTION } from './action';
import { type SearchState } from './state';
import { produce } from 'immer';

export const reducer = produce((state: SearchState, action: ACTION): SearchState => {
  switch (action.type) {
    case 'POPULATE': {
      state = action.payload;
      return state;
    }
    case 'SET_PUBLICATION_STATE_FILTER': {
      state.filters.published = action.payload.filters?.published;
      return state;
    }
    case 'SET_CONCEPT_STATUS_FILTER': {
      state.filters.status = action.payload.filters?.status;
      return state;
    }
    case 'SET_SUBJECTS_FILTER': {
      state.filters.subject = action.payload.filters?.subject;
      return state;
    }
    case 'SET_INTERNAL_FIELDS_FILTER': {
      const internalFields = action.payload.filters?.internalFields;
      if (internalFields) {
        if (Object.values(internalFields).some((field) => field.length > 0)) {
          state.filters.internalFields = internalFields;
        } else {
          delete state.filters.internalFields;
        }
      }
      return state;
    }
    case 'SET_ASSIGNED_USER_FILTER': {
      state.filters.assignedUser = action.payload.filters?.assignedUser;
      return state;
    }
    case 'SET_LABEL_FILTER': {
      state.filters.label = action.payload.filters?.label;
      return state;
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
});
