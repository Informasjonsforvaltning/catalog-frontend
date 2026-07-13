"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./catalog-tabs-layout.module.css";

export type CatalogTab = "concepts" | "changeRequests" | "activityLog";

const tabValues: Record<CatalogTab, string> = {
  concepts: "conceptTab",
  changeRequests: "changeRequestTab",
  activityLog: "activityLogTab",
};

type Props = {
  catalogId: string;
  activeTab: CatalogTab;
  children: ReactNode;
};

export const CatalogTabsLayout = ({
  catalogId,
  activeTab,
  children,
}: Props) => {
  const router = useRouter();

  const activeValue = tabValues[activeTab];

  const navigateTo = (path: string) => () =>
    router.push(`/catalogs/${catalogId}/${path}`);

  return (
    <div className="container">
      <Tabs className={styles.tabs} defaultValue={activeValue} data-size="md">
        <Tabs.List className={styles.tabsList}>
          <Tabs.Tab
            value="conceptTab"
            onClick={
              activeTab === "concepts" ? undefined : navigateTo("concepts")
            }
          >
            {localization.concept.concepts}
          </Tabs.Tab>
          <Tabs.Tab
            value="changeRequestTab"
            onClick={
              activeTab === "changeRequests"
                ? undefined
                : navigateTo("change-requests")
            }
          >
            {localization.changeRequest.changeRequest}
          </Tabs.Tab>
          <Tabs.Tab
            value="activityLogTab"
            onClick={
              activeTab === "activityLog"
                ? undefined
                : navigateTo("activity-log")
            }
          >
            {localization.activityLog.title}
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={activeValue} className={styles.tabsContent}>
          {children}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default CatalogTabsLayout;
