"use client";

import { createContext, useContext, ReactNode } from "react";

interface FeatureFlags {}

const FeatureFlagsContext = createContext<FeatureFlags>({});

export const FeatureFlagsProvider = ({
  children,
  ...flags
}: FeatureFlags & { children: ReactNode }) => (
  <FeatureFlagsContext.Provider value={flags}>
    {children}
  </FeatureFlagsContext.Provider>
);

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
