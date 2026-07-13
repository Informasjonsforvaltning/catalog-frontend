"use client";

import { useEffect, useRef } from "react";
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
  const isInitialItemTypeMount = useRef(true);
  const isInitialStatusMount = useRef(true);
  const onItemTypeChangeRef = useRef(itemType.onChange);
  onItemTypeChangeRef.current = itemType.onChange;
  const onStatusChangeRef = useRef(status.onChange);
  onStatusChangeRef.current = status.onChange;

  const {
    getRadioProps,
    setValue: setItemTypeValue,
    value: itemTypeGroupValue,
  } = useRadioGroup({
    value: itemType.selected,
  });

  const {
    getCheckboxProps,
    setValue: setStatusValue,
    value: statusGroupValue,
  } = useCheckboxGroup({
    value: status.selected,
  });

  useEffect(() => {
    setItemTypeValue(itemType.selected);
  }, [itemType.selected, setItemTypeValue]);

  useEffect(() => {
    if (isInitialItemTypeMount.current) {
      isInitialItemTypeMount.current = false;
      return;
    }
    if (itemTypeGroupValue !== itemType.selected) {
      onItemTypeChangeRef.current(itemTypeGroupValue);
    }
  }, [itemTypeGroupValue, itemType.selected]);

  useEffect(() => {
    setStatusValue(status.selected);
  }, [status.selected, setStatusValue]);

  useEffect(() => {
    if (isInitialStatusMount.current) {
      isInitialStatusMount.current = false;
      return;
    }
    if (
      statusGroupValue.length !== status.selected.length ||
      statusGroupValue.some((value) => !status.selected.includes(value))
    ) {
      onStatusChangeRef.current(statusGroupValue);
    }
  }, [statusGroupValue, status.selected]);

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
