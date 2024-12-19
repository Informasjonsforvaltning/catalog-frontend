'use client';

import { DataService, Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import {
  AddButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormikSearchCombobox,
  TextareaWithPrefix,
  TitleWithTag,
} from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Combobox, Label, Modal, Textfield } from '@digdir/designsystemet-react';
import {
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchMediaTypeByUri,
  useSearchMediaTypes,
} from '../../../../hooks/useReferenceDataSearch';
import { useSearchDataServiceByUri, useSearchDataServiceSuggestions } from '../../../../hooks/useSearchService';
import { Field, FieldArray, Formik } from 'formik';
import { ReactNode, useRef, useState } from 'react';
import styles from './distributions.module.css';
import { distributionTemplate } from '../../utils/dataset-initial-values';
import { distributionSectionSchema } from '../../utils/validation-schema';
import FieldsetWithDelete from '../../../fieldset-with-delete';

interface Props {
  trigger: ReactNode;
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
  onSuccess: (def: Distribution) => void;
  distribution: Distribution | undefined;
  type: 'new' | 'edit';
}

export const DistributionModal = ({
  referenceDataEnv,
  searchEnv,
  openLicenses,
  onSuccess,
  trigger,
  distribution,
  type,
}: Props) => {
  const template = distributionTemplate(distribution);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const [searchQueryMediaTypes, setSearchQueryMediaTypes] = useState<string>('');
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');
  const [searchDataServicesQuery, setSearchDataServicesQuery] = useState<string>('');

  const { data: mediaTypes, isLoading: searchingMediaTypes } = useSearchMediaTypes(
    searchQueryMediaTypes,
    referenceDataEnv,
  );

  const { data: selectedMediaTypes, isLoading: loadingSelectedMediaTypes } = useSearchMediaTypeByUri(
    distribution?.mediaType ?? [],
    referenceDataEnv,
  );

  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);

  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } = useSearchFileTypeByUri(
    distribution?.format ?? [],
    referenceDataEnv,
  );

  const { data: selectedDataServices, isLoading: isLoadingSelectedDataServices } = useSearchDataServiceByUri(
    searchEnv,
    distribution?.accessServiceList ?? [],
  );

  const { data: dataServices } = useSearchDataServiceSuggestions(searchEnv, searchDataServicesQuery);

  const comboboxOptions = [
    // Combine selectedDataServices and dataServices, adding missing URIs
    ...new Map(
      [
        ...(selectedDataServices ?? []),
        ...(dataServices ?? []),
        ...(distribution?.accessServiceList ?? []).map((uri) => {
          const foundItem =
            selectedDataServices?.find((item) => item.uri === uri) ||
            dataServices?.find((item: DataService) => item.uri === uri);

          return {
            uri,
            title: foundItem?.title ?? null,
          };
        }),
      ].map((option) => [option.uri, option]),
    ).values(),
  ];

  return (
    <Modal.Root>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        className={styles.dialog}
      >
        <Formik
          initialValues={template}
          name='distribution'
          validateOnChange={submitted}
          validateOnBlur={submitted}
          validationSchema={distributionSectionSchema}
          onSubmit={(values, { setSubmitting }) => {
            const trimmedValues = trimObjectWhitespace(values);
            onSuccess(trimmedValues);
            setSubmitting(false);
            setSubmitted(true);
            modalRef.current?.close();
          }}
        >
          {({ errors, isSubmitting, submitForm, setFieldValue, values }) => (
            <>
              {distribution && (
                <>
                  <Modal.Header closeButton={false}>
                    {type === 'new' ? localization.datasetForm.button.addDistribution : localization.edit}
                  </Modal.Header>

                  <Modal.Content className={styles.modalContent}>
                    <FormikLanguageFieldset
                      as={Textfield}
                      name='title'
                      legend={
                        <TitleWithTag
                          title={localization.title}
                          tagTitle='Anbefalt'
                          tagColor='info'
                        />
                      }
                    />

                    <FieldsetDivider />

                    <Field
                      name='accessURL[0]'
                      as={Textfield}
                      size='sm'
                      label={
                        <TitleWithTag
                          title={localization.datasetForm.fieldLabel.accessUrl}
                          tagTitle={localization.tag.required}
                        />
                      }
                      error={errors?.accessURL?.[0]}
                    />

                    <Field
                      name='downloadURL[0]'
                      as={Textfield}
                      size='sm'
                      label={localization.datasetForm.fieldLabel.downloadUrl}
                      error={errors?.downloadURL?.[0]}
                    />
                    <FieldsetDivider />

                    <div className={styles.fieldContainer}>
                      <TitleWithTag
                        title={localization.datasetForm.fieldLabel.format}
                        tagTitle={localization.tag.recommended}
                        tagColor='info'
                      />
                      <FormikSearchCombobox
                        onChange={(event) => setSearchQueryFileTypes(event.target.value)}
                        onValueChange={(selectedValues) => setFieldValue('format', selectedValues)}
                        value={values?.format || []}
                        selectedValuesSearchHits={selectedFileTypes ?? []}
                        querySearchHits={fileTypes ?? []}
                        formikValues={distribution?.format ?? []}
                        loading={loadingSelectedFileTypes || searchingFileTypes}
                        portal={false}
                      />
                    </div>

                    <FormikSearchCombobox
                      onChange={(event) => setSearchQueryMediaTypes(event.target.value)}
                      onValueChange={(selectedValues) => setFieldValue('mediaType', selectedValues)}
                      value={values?.mediaType || []}
                      selectedValuesSearchHits={selectedMediaTypes ?? []}
                      querySearchHits={mediaTypes ?? []}
                      formikValues={distribution?.mediaType ?? []}
                      loading={loadingSelectedMediaTypes || searchingMediaTypes}
                      portal={false}
                      label={localization.datasetForm.fieldLabel.mediaTypes}
                    />
                    <FieldsetDivider />

                    {!isLoadingSelectedDataServices && (
                      <Combobox
                        multiple
                        portal={false}
                        onChange={(event) => setSearchDataServicesQuery(event.target.value)}
                        value={[...(values.accessServiceList || []), ...(distribution?.accessServiceList || [])]}
                        onValueChange={(selectedValues) => setFieldValue('accessServiceList', selectedValues)}
                        label={localization.datasetForm.fieldLabel.accessService}
                        placeholder={`${localization.search.search}...`}
                        size='sm'
                      >
                        {comboboxOptions.map((option) => (
                          <Combobox.Option
                            key={option.uri}
                            value={option.uri}
                          >
                            {option.title ? getTranslateText(option.title) : option.uri}
                          </Combobox.Option>
                        ))}
                      </Combobox>
                    )}

                    <FieldsetDivider />

                    <Combobox
                      label={localization.datasetForm.fieldLabel.license}
                      // @ts-expect-error: uri exists on the object
                      value={values?.license?.uri ? [values?.license.uri] : []}
                      portal={false}
                      onValueChange={(selectedValues) => setFieldValue('license.uri', selectedValues.toString())}
                      size='sm'
                    >
                      {openLicenses.map((license) => (
                        <Combobox.Option
                          key={license.uri}
                          value={license.uri}
                        >
                          {getTranslateText(license.label)}
                        </Combobox.Option>
                      ))}
                    </Combobox>
                    <FieldsetDivider />

                    <FormikLanguageFieldset
                      as={TextareaWithPrefix}
                      legend={localization.description}
                      name='description'
                    />
                    <FieldsetDivider />

                    <Field
                      label={localization.datasetForm.fieldLabel.distributionLink}
                      as={Textfield}
                      name='page[0].uri'
                      size='sm'
                      // @ts-expect-error: uri exists on the object
                      error={errors?.page?.[0]?.uri}
                    />

                    <FieldsetDivider />

                    <Label>{localization.datasetForm.fieldLabel.standard}</Label>
                    <FieldArray name='conformsTo'>
                      {({ push, remove }) => (
                        <>
                          {distribution.conformsTo?.map((_, i) => (
                            <div
                              key={i}
                              className={styles.standard}
                            >
                              <FieldsetWithDelete onDelete={() => remove(i)}>
                                <Field
                                  label={localization.title}
                                  as={Textfield}
                                  size='sm'
                                  name={`conformsTo[${i}].prefLabel.nb`}
                                  className={styles.standardField}
                                />
                                <Field
                                  label={localization.link}
                                  as={Textfield}
                                  name={`conformsTo[${i}].uri`}
                                  size='sm'
                                  // @ts-expect-error: uri exists on the object
                                  error={errors?.conformsTo?.[i]?.uri}
                                  className={styles.standardField}
                                />
                              </FieldsetWithDelete>
                            </div>
                          ))}
                          <AddButton onClick={() => push({ uri: '', prefLabel: { nb: '' } })}>
                            {localization.datasetForm.button.addStandard}
                          </AddButton>
                        </>
                      )}
                    </FieldArray>
                  </Modal.Content>

                  <Modal.Footer>
                    <Button
                      type='button'
                      disabled={isSubmitting}
                      onClick={() => submitForm()}
                      size='sm'
                    >
                      {type === 'new' ? localization.add : localization.datasetForm.button.updateDistribution}
                    </Button>
                    <Button
                      variant='secondary'
                      type='button'
                      onClick={() => modalRef.current?.close()}
                      disabled={isSubmitting}
                      size='sm'
                    >
                      {localization.button.cancel}
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </>
          )}
        </Formik>
      </Modal.Dialog>
    </Modal.Root>
  );
};
