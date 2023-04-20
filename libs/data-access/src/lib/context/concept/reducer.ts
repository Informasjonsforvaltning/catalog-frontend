import {ACTION} from './action';
import {type ConceptState} from './state';
import {produce} from 'immer';

export const reducer = produce(
  (state: ConceptState, action: ACTION): ConceptState => {
    switch (action.type) {
      case 'POPULATE': {
        state = action.payload;
        return state;
      }
      default:
        throw new Error(`Unknown action type ${action.type}`);
    }
  }
);
