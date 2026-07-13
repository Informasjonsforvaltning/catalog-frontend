"use client";

import { ReactNode } from "react";
import { SearchHitsLayout } from "@catalog-frontend/ui";
import { CatalogTabsLayout } from "@concept-catalog/components";
import ActivityLogFilter from "../../../../components/activity-log-filter";

type Props = {
  catalogId: string;
  children: ReactNode;
};

export const ActivityLogPageClient = ({ catalogId, children }: Props) => {
  return (
    <CatalogTabsLayout catalogId={catalogId} activeTab="activityLog">
      <SearchHitsLayout>
        <SearchHitsLayout.LeftColumn>
          <ActivityLogFilter catalogId={catalogId} />
        </SearchHitsLayout.LeftColumn>
        <SearchHitsLayout.MainColumn>{children}</SearchHitsLayout.MainColumn>
      </SearchHitsLayout>
    </CatalogTabsLayout>
  );
};

export default ActivityLogPageClient;
