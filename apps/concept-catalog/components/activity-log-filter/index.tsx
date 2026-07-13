"use client";

import { useEffect, useRef } from "react";
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
  const isInitialMount = useRef(true);

  const options = [
    { label: localization.activityLog.conceptActivity, value: "concepts" },
    { label: localization.activityLog.commentActivity, value: "comments" },
  ];

  const {
    getRadioProps,
    setValue,
    value: groupValue,
  } = useRadioGroup({
    value: view,
  });

  useEffect(() => {
    setValue(view);
  }, [view, setValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (groupValue !== view) {
      router.push(`/catalogs/${catalogId}/activity-log?view=${groupValue}`);
    }
  }, [groupValue, view, catalogId, router]);

  return (
    <div className={styles.accordionContainer}>
      <Card>
        <Details defaultOpen>
          <Details.Summary>
            {localization.activityLog.selectType}
          </Details.Summary>
          <Details.Content>
            <Fieldset data-size="sm">
              <Fieldset.Legend>
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
