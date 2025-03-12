import { Checkbox } from '@digdir/designsystemet-react';

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
  return (
    <Checkbox.Group
      onChange={onChange}
      size='small'
      value={value}
      legend={''}
    >
      {items.map(({ value, label }) => (
        <Checkbox
          size='small'
          key={`checkbox-item-${value}`}
          value={`${value}`}
        >
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};
