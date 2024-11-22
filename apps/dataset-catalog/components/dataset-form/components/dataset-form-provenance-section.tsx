'use client';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { FormContainer, FormikLanguageFieldset, TextareaWithPrefix } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox, Textfield, Textarea, Label } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';

interface Props {
  data: { provenanceStatements: ReferenceDataCode[]; frequencies: ReferenceDataCode[] };
}

export const ProvenanceSection = ({ data }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const { provenanceStatements, frequencies } = data;

  return (
    <>
      <Combobox
        value={values?.provenance?.uri ? [values?.provenance?.uri] : []}
        placeholder={`${localization.search.search}...`}
        onValueChange={(value: string[]) => setFieldValue('provenance.uri', value.toString())}
        label={localization.datasetForm.heading.provenance}
      >
        <Combobox.Empty>{`${localization.choose}...`}</Combobox.Empty>
        {provenanceStatements.map((item) => (
          <Combobox.Option
            value={item.uri}
            key={item.uri}
          >
            {getTranslateText(item.label)}
          </Combobox.Option>
        ))}
      </Combobox>

      <Combobox
        value={[values?.accrualPeriodicity?.uri ?? '']}
        virtual
        placeholder={`${localization.search.search}...`}
        onValueChange={(value: string[]) => setFieldValue('accrualPeriodicity.uri', value.toString())}
        label={localization.datasetForm.heading.frequency}
      >
        <Combobox.Option value=''>{`${localization.choose}...`}</Combobox.Option>
        {frequencies.map((item) => (
          <Combobox.Option
            value={item.uri}
            key={item.uri}
          >
            {capitalizeFirstLetter(getTranslateText(item.label).toString())}
          </Combobox.Option>
        ))}
      </Combobox>

      <Field
        as={Textfield}
        name='modified'
        type='date'
        label={localization.datasetForm.heading.lastUpdated}
      />
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name='hasCurrentnessAnnotation.hasBody'
        legend={localization.datasetForm.heading.actuality}
      />
    </>
  );
};
