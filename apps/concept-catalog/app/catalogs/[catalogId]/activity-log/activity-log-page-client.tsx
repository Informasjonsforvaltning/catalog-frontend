"use client";

import { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, ToggleGroup } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  children: ReactNode;
};

export const ActivityLogPageClient = ({ catalogId, children }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "concepts";

  const handleViewChange = (value: string) => {
    router.push(`/catalogs/${catalogId}/activity-log?view=${value}`);
  };

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
          <ToggleGroup
            className={styles.toggleGroup}
            value={view}
            onChange={handleViewChange}
            size="small"
          >
            <ToggleGroup.Item value="concepts">
              {localization.activityLog.conceptActivity}
            </ToggleGroup.Item>
            <ToggleGroup.Item value="comments">
              {localization.activityLog.commentActivity}
            </ToggleGroup.Item>
          </ToggleGroup>
          {children}
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default ActivityLogPageClient;
