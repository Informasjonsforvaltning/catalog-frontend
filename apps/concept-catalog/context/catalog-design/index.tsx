'use client';

import { createContext } from 'react';

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

const useCatalogDesign = () => {
  const { catalogId } = useParams();
  const { data: design } = useGetCatalogDesign(catalogId);
  return design;
};

export { useCatalogDesign };
