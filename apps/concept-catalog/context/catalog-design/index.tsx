'use client';

import { createContext, type ReactNode } from 'react';

import { useGetCatalogDesign } from '../../hooks/catalog-admin';
import { Design } from '@catalog-frontend/types';
import { useParams } from 'next/navigation';

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

const useCatalogDesign = () => {
  const { catalogId } = useParams();
  const { data: design } = useGetCatalogDesign(catalogId);
  return design;
};

export { useCatalogDesign };
