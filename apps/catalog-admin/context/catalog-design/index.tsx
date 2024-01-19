import { createContext, type ReactNode, useContext } from 'react';

import { useGetDesign } from '../../hooks/design';
import { Design } from '@catalog-frontend/types';

interface ContextProps {
  design?: Design;
}

const context: ContextProps = {
  design: undefined,
};

const CatalogDesignContext = createContext(context);
CatalogDesignContext.displayName = 'CatalogDesignContext';

interface ProviderProps {
  children: ReactNode;
  design?: Design;
  catalogId: string;
}

const CatalogDesignContextProvider = ({ children, catalogId }: ProviderProps) => {
  const { data: design } = useGetDesign(catalogId);

  return <CatalogDesignContext.Provider value={{ design }}>{children}</CatalogDesignContext.Provider>;
};

const useCatalogDesign = () => {
  const { design } = useContext(CatalogDesignContext);
  return design;
};

export { CatalogDesignContextProvider, useCatalogDesign };
