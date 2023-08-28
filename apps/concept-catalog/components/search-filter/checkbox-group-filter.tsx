import { Checkbox } from '@catalog-frontend/ui';
import { useSearchState } from '../../context/search';

type CheckboxGroupFilterItem<T> = {
  value: T;
  label: string;
};

interface Props<T> {
  items: CheckboxGroupFilterItem<T>[];
  filterName: string;
  onChange: (names: string[]) => void;
}

export const CheckboxGroupFilter = <T,>({ items, filterName, onChange }: Props<T>) => {
  const searchState = useSearchState();

  return (
    <Checkbox.Group onChange={onChange}>
      {items.map(({ value, label }) => (
        <Checkbox
          checked={searchState.filters[filterName]?.includes(value)}
          key={`checkbox-item-${value}`}
          value={value as string}
        >
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
};
