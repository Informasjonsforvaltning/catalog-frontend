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
  value,
}: Props<T>) => {
  const { getCheckboxProps } = useCheckboxGroup({ onChange, value });
  return (
    <Fieldset>
      {items.map(({ value, label }) => (
        <Checkbox
          data-size="small"
          key={value}
          label={label}
          {...getCheckboxProps({ value })}
        />
      ))}
    </Fieldset>
  );
};
