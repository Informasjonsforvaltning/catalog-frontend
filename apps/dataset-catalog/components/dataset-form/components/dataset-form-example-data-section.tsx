'use client';
import { Dataset } from '@catalog-frontend/types';
import { FormContainer, FormikSearchCombobox } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea } from '@digdir/designsystemet-react';
import {
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchMediaTypeByUri,
  useSearchMediaTypes,
} from '../../../hooks/useReferenceDataSearch';
import { Field, useFormikContext } from 'formik';
import { useState } from 'react';

interface Props {
  referenceDataEnv: string;
}

export const ExampleDataSection = ({ referenceDataEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [searchQueryMediaTypes, setSearchQueryMediaTypes] = useState<string>('');
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');

  const { data: mediaTypes, isLoading: searchingMediaTypes } = useSearchMediaTypes(
    searchQueryMediaTypes,
    referenceDataEnv,
  );

  const { data: selectedMediaTypes, isLoading: loadingSelectedMediaTypes } = useSearchMediaTypeByUri(
    values?.sample?.[0]?.mediaType ?? [],
    referenceDataEnv,
  );

  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);

  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } = useSearchFileTypeByUri(
    values?.sample?.[0]?.format ?? [],
    referenceDataEnv,
  );

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.exampleData}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title='Nedlastningslenke'
          subtitle={localization.datasetForm.helptext.status}
        />
        <Field
          name={`sample[0].downloadURL`}
          as={Textfield}
          label='Nedlastninglenke'
        />
        <Field
          name={`sample[0].accessURL`}
          as={Textfield}
          label='Tilgangslenke'
        />
        <FormContainer.Header
          title='Format'
          subtitle={localization.datasetForm.helptext.fileTypes}
        />

        <FormikSearchCombobox
          onChange={(event) => setSearchQueryFileTypes(event.target.value)}
          onValueChange={(selectedValues: string[]) => setFieldValue(`sample[0].format`, selectedValues)}
          value={(values?.sample && values?.sample[0]?.format) || []}
          selectedValuesSearchHits={selectedFileTypes ?? []}
          querySearchHits={fileTypes ?? []}
          formikValues={values?.sample?.[0]?.format ?? []}
          loading={loadingSelectedFileTypes || searchingFileTypes}
        />

        <FormContainer.Header
          title='Media type'
          subtitle={localization.datasetForm.helptext.mediaTypes}
        />

        <FormikSearchCombobox
          onChange={(event) => setSearchQueryMediaTypes(event.target.value)}
          onValueChange={(selectedValues: string[]) => setFieldValue(`sample[0].mediaType`, selectedValues)}
          value={(values?.sample && values?.sample[0]?.mediaType) || []}
          selectedValuesSearchHits={selectedMediaTypes ?? []}
          querySearchHits={mediaTypes ?? []}
          formikValues={values?.sample?.[0]?.mediaType ?? []}
          loading={loadingSelectedMediaTypes || searchingMediaTypes}
          virtual
        />

        <FormContainer.Header
          title={localization.description}
          subtitle={localization.datasetForm.helptext.status}
        />
        <Field
          as={Textarea}
          label={localization.description}
          name={`sample[0].description.nb`}
        />
      </FormContainer>
    </div>
  );
};
