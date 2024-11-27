'use client';
import { Dataset } from '@catalog-frontend/types';
import { FormContainer, FormikSearchCombobox } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Textfield, Textarea, Label } from '@digdir/designsystemet-react';
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
    <>
      <Field
        name={`sample[0].downloadURL`}
        as={Textfield}
        label={localization.datasetForm.fieldLabel.downloadURL}
      />
      <Field
        name={`sample[0].accessURL`}
        as={Textfield}
        label={localization.datasetForm.fieldLabel.accessURL}
      />

      <FormikSearchCombobox
        onChange={(event) => setSearchQueryFileTypes(event.target.value)}
        onValueChange={(selectedValues: string[]) => setFieldValue(`sample[0].format`, selectedValues)}
        value={(values?.sample && values?.sample[0]?.format) || []}
        selectedValuesSearchHits={selectedFileTypes ?? []}
        querySearchHits={fileTypes ?? []}
        formikValues={values?.sample?.[0]?.format ?? []}
        loading={loadingSelectedFileTypes || searchingFileTypes}
        label={localization.datasetForm.fieldLabel.format}
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
        label={localization.datasetForm.fieldLabel.mediaTypes}
      />

      <Field
        as={Textarea}
        label={localization.description}
        name={`sample[0].description.nb`}
      />
    </>
  );
};
