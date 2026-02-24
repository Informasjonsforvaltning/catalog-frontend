"use client";

import { useEffect } from "react";
import {
  Checkbox,
  Fieldset,
  useCheckboxGroup,
} from "@digdir/designsystemet-react";

type CheckboxGroupFilterItem<T> = {
  value: T;
  label: string;
};

interface Props<T extends string> {
  items: CheckboxGroupFilterItem<T>[];
  onChange: (value: string[]) => void;
  value?: string[];
}

export const CheckboxGroupFilter = <T extends string>({
  items,
  onChange,
  value = [],
}: Props<T>) => {
  const { getCheckboxProps, setValue } = useCheckboxGroup({ onChange, value });

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  return (
    <Fieldset>
      {items.map(({ value, label }) => (
        <Checkbox
          data-size="sm"
          key={value}
          {...getCheckboxProps({ value })}
          label={label}
          aria-label={label}
        />
      ))}
    </Fieldset>
  );
};
