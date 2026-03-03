"use client";

import {
  Card,
  Checkbox,
  Details,
  Fieldset,
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
    <Card className={styles.accordionContainer}>
      <Details defaultOpen>
        <Details.Summary>{localization.filter}</Details.Summary>
        <Details.Content>
          <Fieldset data-size="sm">
            <Fieldset.Legend>{localization.filter}</Fieldset.Legend>
            {itemType.options.map((option) => (
              <Radio
                key={option.value}
                {...getRadioProps(option.value)}
                label={option.label}
              />
            ))}
          </Fieldset>
        </Details.Content>
      </Details>
      <Details defaultOpen>
        <Details.Summary>{localization.status}</Details.Summary>
        <Details.Content>
          <Fieldset data-size="sm">
            <Fieldset.Legend>{localization.status}</Fieldset.Legend>
            {status.options.map((statusItem) => (
              <Checkbox
                key={statusItem.value}
                label={statusItem.label}
                {...getCheckboxProps(statusItem.value)}
              />
            ))}
          </Fieldset>
        </Details.Content>
      </Details>
    </Card>
  );
};

export default ChangeRequestsFilter;
