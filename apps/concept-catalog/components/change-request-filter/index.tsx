"use client";

import {
  Card,
  Checkbox,
  Details,
  Radio,
  useRadioGroup,
  useCheckboxGroup,
} from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { ItemType, Status } from "@catalog-frontend/types";
import styles from "./change-request-filter.module.css";

type Props = {
  itemType: ItemType;
  status: Status;
};

const ChangeRequestsFilter = ({ itemType, status }: Props) => {
  const { getRadioProps } = useRadioGroup({
    value: itemType.selected,
    onChange: (nextValue) => itemType.onChange(nextValue),
  });

  const { getCheckboxProps } = useCheckboxGroup({
    value: status.selected,
    onChange: status.onChange,
  });

  return (
    <div className={styles.accordionContainer}>
      <Card>
        <Details defaultOpen>
          <Details.Summary>{localization.filter}</Details.Summary>
          <Details.Content>
            <div data-size="sm">
              {itemType.options.map((option) => (
                <Radio
                  key={option.value}
                  {...getRadioProps(option.value)}
                  label={option.label}
                />
              ))}
            </div>
          </Details.Content>
        </Details>
        <Details defaultOpen>
          <Details.Summary>{localization.status}</Details.Summary>
          <Details.Content>
            <div data-size="sm">
              {status.options.map((statusItem) => (
                <Checkbox
                  key={statusItem.value}
                  label={statusItem.label}
                  {...getCheckboxProps(statusItem.value)}
                />
              ))}
            </div>
          </Details.Content>
        </Details>
      </Card>
    </div>
  );
};

export default ChangeRequestsFilter;
