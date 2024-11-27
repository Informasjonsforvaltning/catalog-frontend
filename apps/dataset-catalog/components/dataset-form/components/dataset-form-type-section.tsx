'use client';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { FormContainer } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';

type Props = {
  datasetTypes: ReferenceDataCode[];
};

export const TypeSection = ({ datasetTypes }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  return (
    <div>
      <Field
        as={Combobox}
        name='type'
        value={[values.type]}
        virtual
        label={localization.datasetForm.fieldLabel.type}
        placeholder={`${localization.search.search}...`}
        onValueChange={(value: string[]) => setFieldValue('type', value.toString())}
      >
        <Combobox.Option value={''}>{`${localization.choose}...`}</Combobox.Option>
        {datasetTypes.map((type) => (
          <Combobox.Option
            value={type.uri}
            key={type.uri}
            description={`${localization.code}: ${type.code}`}
          >
            {getTranslateText(type?.label)}
          </Combobox.Option>
        ))}
      </Field>
    </div>
  );
};
