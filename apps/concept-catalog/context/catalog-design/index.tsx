'use client';

import { createContext, type ReactNode, useContext } from 'react';

import { useGetCatalogDesign } from '../../hooks/catalog-admin';
import { useRouter } from 'next/navigation';
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
}

const CatalogDesignContextProvider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const { data: design } = useGetCatalogDesign(router.query.catalogId);

  return <CatalogDesignContext.Provider value={{ design }}>{children}</CatalogDesignContext.Provider>;
};

const useCatalogDesign = () => {
  const { design } = useContext(CatalogDesignContext);
  return design;
};

export { CatalogDesignContextProvider, useCatalogDesign };
