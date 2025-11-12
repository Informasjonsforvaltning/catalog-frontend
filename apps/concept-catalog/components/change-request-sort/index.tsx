import { Option } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { NativeSelect } from '@digdir/designsystemet-react';
import { ChangeEvent } from 'react';

interface Props {
  options: Option[];
  selected: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const ChangeRequestSort = ({ options, selected, onChange }: Props) => {
  return (
    <NativeSelect
      onChange={onChange}
      value={selected}
      data-size='sm'
    >
      {options.map((option: Option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </NativeSelect>
  );
};

export default ChangeRequestSort;
