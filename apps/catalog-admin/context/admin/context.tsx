"use client";

import { createContext, useReducer, type ReactNode, useContext } from "react";

import { reducer } from "./reducer";
import { DefaultAdminState } from "./state";
import { type AdminState } from "./state";
import { ACTION } from "./action";

interface ContextProps {
  state: AdminState;
  dispatch: (action: ACTION) => void;
}

const context: ContextProps = {
  state: DefaultAdminState,
  dispatch: () => undefined,
};

const AdminContext = createContext(context);
AdminContext.displayName = "AdminContext";

interface StateProviderProps {
  children: ReactNode;
  AdminState?: AdminState;
}

const AdminContextProvider = ({ children }: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, DefaultAdminState);

  const value = {
    state,
    dispatch,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

const useAdminState = () => {
  const { state } = useContext(AdminContext);
  return state;
};

const useAdminDispatch = () => {
  const { dispatch } = useContext(AdminContext);
  return dispatch;
};

export { AdminContextProvider, useAdminState, useAdminDispatch };
