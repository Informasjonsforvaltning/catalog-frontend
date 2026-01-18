import { Fieldset, Checkbox, useCheckboxGroup } from '@digdir/designsystemet-react';

type CheckboxGroupFilterItem<T> = {
  value: T;
  label: string;
};

interface Props<T> {
  items: CheckboxGroupFilterItem<T>[];
  onChange: (value: string[]) => void;
  value?: string[];
}

export const CheckboxGroupFilter = <T,>({ items, onChange, value }: Props<T>) => {
  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup({
    value: value ?? [],
    onChange,
  });

  return (
    <Fieldset>
      {items.map(({ value: itemValue, label }) => (
        <Checkbox
          data-size='sm'
          key={`checkbox-item-${itemValue}`}
          label={label}
          {...getCheckboxProps({ value: String(itemValue) })}
        />
      ))}
    </Fieldset>
  );
};
