import {ACTION} from './action';
import {type ConceptState} from './state';
import {produce} from 'immer';

export const reducer = produce(
  (state: ConceptState, action: ACTION): ConceptState => {
    switch (action.type) {
      case 'POPULATE': {
        state = action.payload as ConceptState;
        return state;
      }
      case 'SEARCH': {
        state.concepts = action.payload.hits;
        state.page = action.payload.page;
        return state;
      }
      default:
        throw new Error(`Unknown action type ${action.type}`);
    }
  }
);
