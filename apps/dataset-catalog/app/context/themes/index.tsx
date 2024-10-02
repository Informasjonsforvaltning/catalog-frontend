'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getDataThemes, getLosThemes } from '../../actions/actions';
import { DataTheme, LosTheme } from '@catalog-frontend/types';

interface ThemesContextProps {
  losThemes: LosTheme[] | undefined;
  dataThemes: DataTheme[] | undefined;
  loading: boolean;
}

const ThemesContext = createContext<ThemesContextProps | undefined>(undefined);
ThemesContext.displayName = 'ThemesContext';

const ThemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [losThemes, setLosThemes] = useState<LosTheme[] | undefined>(undefined);
  const [dataThemes, setDataThemes] = useState<DataTheme[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const los = await getLosThemes();
        const data: DataTheme[] = await getDataThemes();
        setLosThemes(los.flat());
        setDataThemes(data);
      } catch (error) {
        console.error('Failed to fetch themes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  return <ThemesContext.Provider value={{ losThemes, dataThemes, loading }}>{children}</ThemesContext.Provider>;
};

const useThemes = () => {
  const context = useContext(ThemesContext);
  if (!context) {
    throw new Error('useThemes must be used within a ThemesProvider');
  }
  return context;
};

export { ThemesProvider, useThemes };
