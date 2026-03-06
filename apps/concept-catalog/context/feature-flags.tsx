"use client";

import { createContext, useContext, ReactNode } from "react";

interface FeatureFlags {
  activityLogEnabled: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlags>({
  activityLogEnabled: false,
});

export const FeatureFlagsProvider = ({
  children,
  ...flags
}: FeatureFlags & { children: ReactNode }) => (
  <FeatureFlagsContext.Provider value={flags}>
    {children}
  </FeatureFlagsContext.Provider>
);

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
