import { Checkbox } from '@catalog-frontend/ui';
import { useSearchState } from '../../context/search';
import _ from 'lodash';

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
      value={_.get(searchState.filters, filterName)}
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
