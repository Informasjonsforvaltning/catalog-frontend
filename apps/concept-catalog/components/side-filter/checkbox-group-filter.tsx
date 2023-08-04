import { CheckboxGroup } from '@catalog-frontend/ui';
import { CheckboxGroupItem } from '@digdir/design-system-react';
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
    <CheckboxGroup
      onChange={onChange}
      items={items.map<CheckboxGroupItem>(({ value, label }) => ({
        name: value as string,
        key: `checkbox-item-${value}`,
        label,
        checked: searchState.filters[filterName]?.includes(value),
      }))}
    />
  );
};
