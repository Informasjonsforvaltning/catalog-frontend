"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  children: ReactNode;
};

export const ActivityLogPageClient = ({ catalogId, children }: Props) => {
  const router = useRouter();

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
          <Tabs.Tab value="activityLogTab">{localization.activityLog}</Tabs.Tab>
        </Tabs.List>
        <Tabs.Content value="activityLogTab" className={styles.tabsContent}>
          {children}
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default ActivityLogPageClient;
