'use client';
import { getLosThemes, getDataThemes } from '@catalog-frontend/data-access';
import { LosTheme, DataTheme } from '@catalog-frontend/types';
import React, { createContext, useEffect, useState, ReactNode } from 'react';

type ThemesContextType = {
  losThemes: LosTheme[];
  dataThemes: DataTheme[];
  loading: boolean;
  error: string | null;
};

const ThemesContext = createContext<ThemesContextType | undefined>(undefined);

export const ThemesProvider = ({ children }: { children: ReactNode }) => {
  const [losThemes, setLosThemes] = useState<LosTheme[]>([]);
  const [dataThemes, setDataThemes] = useState<DataTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      setLoading(true);
      try {
        const [los, data] = await Promise.all([getLosThemes(), getDataThemes()]);
        const losThemesData = await los.json();
        const dataThemesData = await data.json();

        setLosThemes(losThemesData.losNodes.flat());
        setDataThemes(dataThemesData.dataThemes);
      } catch (err) {
        console.error(`Failed to fetch reference-data, ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const value = {
    losThemes,
    dataThemes,
    loading,
    error,
  };

  return <ThemesContext.Provider value={value}>{children}</ThemesContext.Provider>;
};

export const useThemes = () => {
  const context = React.useContext(ThemesContext);
  if (context === undefined) {
    throw new Error('useThemes must be used within a ThemesProvider');
  }
  return context;
};
