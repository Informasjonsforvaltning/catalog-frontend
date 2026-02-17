"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Details,
  Fieldset,
  Radio,
  useRadioGroup,
} from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./activity-log-filter.module.css";

type Props = {
  catalogId: string;
};

const ActivityLogFilter = ({ catalogId }: Props) => {
  const router = useRouter();
  const view = useSearchParams().get("view") || "concepts";

  const handleViewChange = (value: string) => {
    router.push(`/catalogs/${catalogId}/activity-log?view=${value}`);
  };

  const options = [
    { label: localization.activityLog.conceptActivity, value: "concepts" },
    { label: localization.activityLog.commentActivity, value: "comments" },
  ];

  const { getRadioProps } = useRadioGroup({
    value: view,
    onChange: (nextValue) => handleViewChange(nextValue),
  });

  return (
    <div className={styles.accordionContainer}>
      <Card>
        <Details defaultOpen>
          <Details.Summary>
            {localization.activityLog.selectType}
          </Details.Summary>
          <Details.Content>
            <Fieldset data-size="sm">
              <Fieldset.Legend className="sr-only">
                {localization.activityLog.selectType}
              </Fieldset.Legend>
              {options.map((option) => (
                <Radio
                  key={option.value}
                  {...getRadioProps(option.value)}
                  label={option.label}
                />
              ))}
            </Fieldset>
          </Details.Content>
        </Details>
      </Card>
    </div>
  );
};

export default ActivityLogFilter;
