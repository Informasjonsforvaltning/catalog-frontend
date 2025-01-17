import { localization } from '@catalog-frontend/utils';
import { Radio } from '@digdir/designsystemet-react';

type Props = {
  onStatusChange: (status: string) => void;
  values: string[];
};

export const Filter = ({ onStatusChange, values }: Props) => {
  return (
    <Radio.Group
      legend='Filtrer på status'
      size='sm'
      onChange={(value) => onStatusChange(value)}
      defaultValue='ALL'
    >
      <Radio value='ALL'>{localization.tag.all}</Radio>
      {values.map((val) => (
        <Radio
          value={val}
          key={`radio-option-${val}`}
        >
          {localization.datasetForm?.filter?.[val]}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export default Filter;
