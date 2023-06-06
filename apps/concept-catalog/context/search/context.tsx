import { createContext, useReducer, type ReactNode, useContext } from 'react';

import { reducer } from './reducer';
import { DefaultSearchState } from './state';
import { type SearchState } from './state';
import { ACTION } from './action';

interface ContextProps {
  state: SearchState;
  dispatch: (action: ACTION) => void;
}

const context: ContextProps = {
  state: DefaultSearchState,
  dispatch: () => null,
};

const SearchContext = createContext(context);
SearchContext.displayName = 'SearchContext';

interface StateProviderProps {
  children: ReactNode;
  SearchState?: SearchState;
}

const SearchContextProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, DefaultSearchState);

  const value = {
    state,
    dispatch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

const useSearchState = () => {
  const { state } = useContext(SearchContext);
  return state;
};

const useSearchDispatch = () => {
  const { dispatch } = useContext(SearchContext);
  return dispatch;
};

export { SearchContextProvider, useSearchState, useSearchDispatch };
