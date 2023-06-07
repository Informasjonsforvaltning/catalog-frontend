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
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
});