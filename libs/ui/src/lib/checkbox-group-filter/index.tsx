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

  const { getCheckboxProps, validationMessageProps } = useCheckboxGroup(items);

  return (
    <Fieldset>
      {items.map(({ value, label }) => (
        <Checkbox
          data-size='sm'
          key={`checkbox-item-${value}`}
          label={label}
          {...getCheckboxProps(label)}
        />
      ))}
    </Fieldset>
  );
};
