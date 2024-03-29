import { ACTION } from './action';
import { type AdminState } from './state';
import { produce } from 'immer';

export const reducer = produce((state: AdminState, action: ACTION): AdminState => {
  switch (action.type) {
    case 'POPULATE': {
      state = action.payload;
      return state;
    }
    case 'SET_BACKGROUND_COLOR': {
      state.backgroundColor = action.payload.backgroundColor;
      return state;
    }
    case 'SET_FONT_COLOR': {
      return { ...state, fontColor: action.payload.fontColor };
    }
    case 'SET_LOGO': {
      return { ...state, logo: action.payload.logo };
    }
    case 'SET_CODE_LISTS': {
      return { ...state, updatedCodeLists: action.payload.updatedCodeLists };
    }
    case 'SET_SHOW_USER_EDITOR': {
      return { ...state, showUserEditor: action.payload.showUserEditor };
    }
    case 'SET_SHOW_INTERNAL_FIELD_EDITOR': {
      return { ...state, showInternalFieldEditor: action.payload.showInternalFieldEditor };
    }
    case 'SET_SHOW_CODE_LIST_EDITOR': {
      return { ...state, showCodeListEditor: action.payload.showCodeListEditor };
    }
    case 'SET_UPDATED_CODES': {
      return { ...state, updatedCodes: action.payload.updatedCodes };
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
});
