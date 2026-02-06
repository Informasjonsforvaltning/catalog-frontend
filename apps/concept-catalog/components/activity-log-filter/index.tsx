"use client";

import { useRouter } from "next/navigation";
import { Accordion, Radio } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./activity-log-filter.module.css";

type Props = {
  catalogId: string;
  view: string;
};

const ActivityLogFilter = ({ catalogId, view }: Props) => {
  const router = useRouter();

  const handleViewChange = (value: string) => {
    router.push(`/catalogs/${catalogId}/activity-log?view=${value}`);
  };

  const options = [
    { label: localization.activityLog.conceptActivity, value: "concepts" },
    { label: localization.activityLog.commentActivity, value: "comments" },
  ];

  return (
    <div className={styles.accordionContainer}>
      <Accordion border>
        <Accordion.Item defaultOpen>
          <Accordion.Header level={3}>
            {localization.activityLog.selectType}
          </Accordion.Header>
          <Accordion.Content>
            <Radio.Group
              hideLegend
              legend={localization.activityLog.selectType}
              size="small"
              onChange={handleViewChange}
              defaultValue={view}
            >
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ActivityLogFilter;
