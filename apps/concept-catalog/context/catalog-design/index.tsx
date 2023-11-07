'use client';

import { createContext, type ReactNode, useContext } from 'react';

import { useGetCatalogDesign } from '../../hooks/catalog-admin';
import { Design } from '@catalog-frontend/types';

interface ContextProps {
  design?: Design;
}

const context: ContextProps = {
  design: null,
};

const CatalogDesignContext = createContext(context);
CatalogDesignContext.displayName = 'CatalogDesignContext';

interface ProviderProps {
  children: ReactNode;
  design?: Design;
  catalogId: string;
}

const CatalogDesignContextProvider = ({ catalogId, children }: ProviderProps) => {
  const { data: design } = useGetCatalogDesign(catalogId);

  return <CatalogDesignContext.Provider value={{ design }}>{children}</CatalogDesignContext.Provider>;
};

const useCatalogDesign = () => {
  const { design } = useContext(CatalogDesignContext);
  return design;
};

export { CatalogDesignContextProvider, useCatalogDesign };
