"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@digdir/designsystemet-react";
import { SearchHitsLayout } from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import ActivityLogFilter from "../../../../components/activity-log-filter";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  children: ReactNode;
};

export const ActivityLogPageClient = ({ catalogId, children }: Props) => {
  const router = useRouter();

  return (
    <div className="container">
      <Tabs
        className={styles.tabs}
        defaultValue="activityLogTab"
        data-size="md"
      >
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
        <Tabs.Panel value="activityLogTab" className={styles.tabsContent}>
          <SearchHitsLayout>
            <SearchHitsLayout.LeftColumn>
              <ActivityLogFilter catalogId={catalogId} />
            </SearchHitsLayout.LeftColumn>
            <SearchHitsLayout.MainColumn>
              {children}
            </SearchHitsLayout.MainColumn>
          </SearchHitsLayout>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default ActivityLogPageClient;
