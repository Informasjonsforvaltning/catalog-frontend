"use client";

import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@digdir/designsystemet-react";
import { SearchHitsLayout } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import ActivityLogFilter from "../../../../components/activity-log-filter";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  children: ReactNode;
};

export const ActivityLogPageClient = ({ catalogId, children }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "concepts";

  return (
    <div className="container">
      <Tabs className={styles.tabs} defaultValue="activityLogTab" size="medium">
        <Tabs.List className={styles.tabsList}>
          <Tabs.Tab
            value="conceptTab"
            onClick={() => router.push(`/catalogs/${catalogId}/concepts`)}
          >
            {localization.concept.concepts}
          </Tabs.Tab>
          <Tabs.Tab
            value="changeRequestTab"
            onClick={() =>
              router.push(`/catalogs/${catalogId}/change-requests`)
            }
          >
            {localization.changeRequest.changeRequest}
          </Tabs.Tab>
          <Tabs.Tab value="activityLogTab">
            {localization.activityLog.title}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="activityLogTab" className={styles.tabsContent}>
          <SearchHitsLayout>
            <SearchHitsLayout.LeftColumn>
              <ActivityLogFilter catalogId={catalogId} view={view} />
            </SearchHitsLayout.LeftColumn>
            <SearchHitsLayout.MainColumn>
              {children}
            </SearchHitsLayout.MainColumn>
          </SearchHitsLayout>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default ActivityLogPageClient;
