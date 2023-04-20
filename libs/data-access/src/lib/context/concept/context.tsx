import {createContext, useReducer, type ReactNode, useContext} from 'react';

import {reducer} from './reducer';
import {DefaultConceptState} from './state';
import {type ConceptState} from './state';
import {ACTION} from './action';

interface ContextProps {
  state: ConceptState;
  dispatch: (action: ACTION) => void;
}

const context: ContextProps = {
  state: DefaultConceptState,
  dispatch: () => null,
};

const ConceptContext = createContext(context);
ConceptContext.displayName = 'ConceptContext';

interface StateProviderProps {
  children: ReactNode;
  conceptState?: ConceptState;
}

const ConceptContextProvider = ({children}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, DefaultConceptState);

  const value = {
    state,
    dispatch,
  };

  return (
    <ConceptContext.Provider value={value}>{children}</ConceptContext.Provider>
  );
};

const useConceptState = () => {
  const {state} = useContext(ConceptContext);
  return state;
};

const useConceptDispatch = () => {
  const {dispatch} = useContext(ConceptContext);
  return dispatch;
};

export {ConceptContextProvider, useConceptState, useConceptDispatch};
