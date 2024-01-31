import { createContext, type ReactNode } from 'react';

import { useGetDesign } from '../../hooks/design';
import { useParams, useRouter } from 'next/navigation';
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

const useCatalogDesign = () => {
  const params = useParams();
  const catalogId = params?.catalogId;
  const { data: design } = useGetDesign(catalogId);
  return design;
};

export { useCatalogDesign };
