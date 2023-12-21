import { Checkbox } from '@catalog-frontend/ui';

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
      value={value}
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
