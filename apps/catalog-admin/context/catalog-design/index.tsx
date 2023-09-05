import { createContext, type ReactNode, useContext } from 'react';

import { useGetDesign } from '../../hooks/design';
import { useRouter } from 'next/router';
import { Design } from '../../../../libs/types/src/lib/design';

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
  const { data: design } = useGetDesign(router.query.catalogId);

  return <CatalogDesignContext.Provider value={{ design }}>{children}</CatalogDesignContext.Provider>;
};

const useCatalogDesign = () => {
  const { design } = useContext(CatalogDesignContext);
  return design;
};

export { CatalogDesignContextProvider, useCatalogDesign };
