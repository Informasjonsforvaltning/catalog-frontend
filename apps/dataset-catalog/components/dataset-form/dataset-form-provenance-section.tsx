'use client';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { FormContainer } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox, Textfield, Textarea } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';

interface Props {
  data: { provenanceStatements: ReferenceDataCode[]; frequencies: ReferenceDataCode[] };
}

export const ProvenanceSection = ({ data }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const { provenanceStatements, frequencies } = data;

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.provenanceAndFrequency}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.datasetForm.heading.provenance}
          subtitle={localization.datasetForm.helptext.provenance}
        />
        <Combobox
          value={[values?.provenance?.uri ?? '']}
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) => setFieldValue('provenance.uri', value.toString())}
        >
          <Combobox.Option value=''>{`${localization.choose}...`}</Combobox.Option>
          {provenanceStatements.map((item) => (
            <Combobox.Option
              value={item.uri}
              key={item.uri}
            >
              {getTranslateText(item.label)}
            </Combobox.Option>
          ))}
        </Combobox>
        <FormContainer.Header
          title={localization.datasetForm.heading.frequency}
          subtitle={localization.datasetForm.helptext.frequency}
        />
        <Combobox
          value={[values?.accrualPeriodicity?.uri ?? '']}
          virtual
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) => setFieldValue('accrualPeriodicity.uri', value.toString())}
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
        <FormContainer.Header
          title={localization.datasetForm.heading.lastUpdated}
          subtitle={localization.datasetForm.helptext.lastUpdated}
        />
        <Field
          as={Textfield}
          name='modified'
          type='date'
        ></Field>
        <FormContainer.Header
          title={localization.datasetForm.heading.actuality}
          subtitle={localization.datasetForm.helptext.actuality}
        />
        <Field
          as={Textarea}
          name='hasCurrentnessAnnotation.hasBody.nb'
        ></Field>
      </FormContainer>
    </div>
  );
};
