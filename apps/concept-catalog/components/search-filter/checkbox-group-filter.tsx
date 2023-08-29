import { Checkbox } from '@catalog-frontend/ui';
import { useSearchState } from '../../context/search';

type CheckboxGroupFilterItem<T> = {
  value: T;
  label: string;
};

interface Props<T> {
  items: CheckboxGroupFilterItem<T>[];
  filterName: string;
  onChange: (value: string[]) => void;
}

export const CheckboxGroupFilter = <T,>({ items, filterName, onChange }: Props<T>) => {
  const searchState = useSearchState();

  return (
    <Checkbox.Group
      onChange={onChange}
      value={searchState.filters[filterName]}
    >
      {items.map(({ value, label }) => (
        <Checkbox
          key={`checkbox-item-${value}`}
          value={value as string}
        >
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};
