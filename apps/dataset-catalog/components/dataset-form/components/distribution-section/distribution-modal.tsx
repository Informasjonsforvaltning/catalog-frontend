'use client';

import { Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import {
  AddButton,
  DeleteButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormikReferenceDataCombobox,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
} from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Card, Combobox, Fieldset, Modal, Textfield } from '@digdir/designsystemet-react';
import {
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchMediaTypeByUri,
  useSearchMediaTypes,
} from '../../../../hooks/useReferenceDataSearch';
import { useSearchDataServiceByUri, useSearchDataServiceSuggestions } from '../../../../hooks/useSearchService';
import { FastField, FieldArray, Formik } from 'formik';
import { ReactNode, useRef, useState } from 'react';
import styles from './distributions.module.scss';
import { distributionTemplate } from '../../utils/dataset-initial-values';
import { distributionSectionSchema } from '../../utils/validation-schema';
import { ToggleFieldButton } from '@dataset-catalog/components/dataset-form/components/toggle-field-button';

type Props = {
  trigger: ReactNode;
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses?: ReferenceDataCode[];
  onSuccess: (values: Distribution, type: string) => void;
  initialValues: Partial<Distribution> | undefined;
  type: 'new' | 'edit';
  distributionType: 'distribution' | 'sample';
};

export const DistributionModal = ({
  referenceDataEnv,
  searchEnv,
  openLicenses,
  onSuccess,
  trigger,
  initialValues,
  type,
  distributionType,
}: Props) => {
  const [selectedAccesServices, setSelectedAccessServices] = useState(initialValues?.accessServiceUris);
  const [selectedFileTypes, setSelectedFileTypes] = useState(initialValues?.format);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState(initialValues?.mediaType);

  const template = distributionTemplate(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const [searchQueryMediaTypes, setSearchQueryMediaTypes] = useState<string>('');
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');
  const [searchDataServicesQuery, setSearchDataServicesQuery] = useState<string>('');

  const { data: mediaTypes, isLoading: searchingMediaTypes } = useSearchMediaTypes(
    searchQueryMediaTypes,
    referenceDataEnv,
  );

  const { data: previouslySelectedMediaTypes, isLoading: loadingSelectedMediaTypes } = useSearchMediaTypeByUri(
    selectedMediaTypes ?? [],
    referenceDataEnv,
  );

  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);

  const { data: previouslySelectedFileTypes, isLoading: loadingSelectedFileTypes } = useSearchFileTypeByUri(
    selectedFileTypes ?? [],
    referenceDataEnv,
  );

  const { data: previouslySelectedAccessServices, isLoading: isLoadingAccessServices } = useSearchDataServiceByUri(
    searchEnv,
    selectedAccesServices ?? [],
  );

  const { data: dataServices } = useSearchDataServiceSuggestions(searchEnv, searchDataServicesQuery);

  const accessServiceOptions = [
    ...new Map(
      [...(previouslySelectedAccessServices ?? []), ...(dataServices ?? [])].map((option) => [option.uri, option]),
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
            onSuccess(trimmedValues, distributionType);
            setSubmitting(false);
            setSubmitted(true);
            modalRef.current?.close();
          }}
        >
          {({ errors, isSubmitting, submitForm, values, setFieldValue }) => {
            return (
              <>
                {initialValues && (
                  <>
                    <Modal.Header closeButton={false}>
                      {type === 'new'
                        ? distributionType === 'distribution'
                          ? localization.datasetForm.button.addDistribution
                          : localization.datasetForm.button.addSample
                        : `${localization.edit} ${distributionType === 'distribution' ? localization.datasetForm.fieldLabel.distribution.toLowerCase() : localization.datasetForm.fieldLabel.sample.toLowerCase()}`}
                    </Modal.Header>

                    <Modal.Content className={styles.modalContent}>
                      {distributionType === 'distribution' && (
                        <>
                          <FormikLanguageFieldset
                            as={Textfield}
                            name='title'
                            legend={
                              <TitleWithHelpTextAndTag
                                helpText={localization.datasetForm.helptext.title}
                                tagTitle={localization.tag.recommended}
                                tagColor='info'
                              >
                                {localization.title}
                              </TitleWithHelpTextAndTag>
                            }
                          />
                          <FieldsetDivider />
                        </>
                      )}
                      <FastField
                        name='accessURL[0]'
                        as={Textfield}
                        size='sm'
                        label={
                          <TitleWithHelpTextAndTag
                            tagTitle={localization.tag.required}
                            helpText={localization.datasetForm.helptext.accessURL}
                          >
                            {localization.datasetForm.fieldLabel.accessURL}
                          </TitleWithHelpTextAndTag>
                        }
                        error={errors?.accessURL?.[0]}
                      />

                      <ToggleFieldButton
                        fieldName='downloadURL'
                        hasDeleteButton
                        fieldValues={values?.downloadURL}
                      >
                        <FastField
                          name='downloadURL[0]'
                          as={Textfield}
                          size='sm'
                          label={
                            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.downloadURL}>
                              {localization.datasetForm.fieldLabel.downloadURL}
                            </TitleWithHelpTextAndTag>
                          }
                          error={errors?.downloadURL?.[0]}
                        />
                      </ToggleFieldButton>

                      {!isLoadingAccessServices && distributionType === 'distribution' && (
                        <ToggleFieldButton
                          fieldName='accessServiceUris'
                          hasDeleteButton
                          fieldValues={values?.accessServiceUris}
                        >
                          <Fieldset
                            size='sm'
                            legend={
                              <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.accessServiceUris}>
                                {localization.datasetForm.fieldLabel.accessServiceUris}
                              </TitleWithHelpTextAndTag>
                            }
                          >
                            <Combobox
                              multiple
                              hideClearButton
                              portal={false}
                              onChange={(event) => setSearchDataServicesQuery(event.target.value)}
                              value={values.accessServiceUris}
                              onValueChange={(selectedValues) => {
                                setFieldValue('accessServiceUris', selectedValues);
                                setSelectedAccessServices(selectedValues);
                              }}
                              placeholder={`${localization.search.search}...`}
                              size='sm'
                              virtual
                            >
                              {accessServiceOptions.map((option, i) => (
                                <Combobox.Option
                                  key={`distribution-${option.uri}-${i}`}
                                  value={option.uri ?? option.description}
                                  displayValue={(getTranslateText(option.title) as string) ?? option.uri}
                                >
                                  <div className={styles.comboboxOptionTwoColumns}>
                                    <div>
                                      {option.title
                                        ? getTranslateText(option.title)
                                        : getTranslateText(option.description)}
                                    </div>
                                    <div>{getTranslateText(option.organization?.prefLabel) ?? ''}</div>
                                  </div>
                                </Combobox.Option>
                              ))}
                            </Combobox>
                          </Fieldset>
                        </ToggleFieldButton>
                      )}

                      <FieldsetDivider />

                      <ToggleFieldButton
                        fieldName='format'
                        hasDeleteButton
                        fieldValues={values?.format}
                      >
                        <Fieldset
                          size='sm'
                          legend={
                            <TitleWithHelpTextAndTag
                              helpText={localization.datasetForm.helptext.fileType}
                              tagTitle={localization.tag.recommended}
                              tagColor='info'
                            >
                              {localization.datasetForm.fieldLabel.format}
                            </TitleWithHelpTextAndTag>
                          }
                        >
                          <FormikReferenceDataCombobox
                            onChange={(event) => setSearchQueryFileTypes(event.target.value)}
                            onValueChange={(selectedValues) => {
                              setFieldValue('format', selectedValues);
                              setSelectedFileTypes(selectedValues);
                            }}
                            value={[...(values.format || []), ...(initialValues?.format || [])]}
                            selectedValuesSearchHits={previouslySelectedFileTypes ?? []}
                            querySearchHits={fileTypes ?? []}
                            formikValues={initialValues?.format ?? []}
                            loading={loadingSelectedFileTypes || searchingFileTypes}
                            portal={false}
                          />
                        </Fieldset>
                      </ToggleFieldButton>

                      <ToggleFieldButton
                        fieldName='mediaType'
                        hasDeleteButton
                        fieldValues={values?.mediaType}
                      >
                        <Fieldset
                          size='sm'
                          legend={
                            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.mediaType}>
                              {localization.datasetForm.fieldLabel.mediaType}
                            </TitleWithHelpTextAndTag>
                          }
                        >
                          <FormikReferenceDataCombobox
                            onChange={(event) => setSearchQueryMediaTypes(event.target.value)}
                            onValueChange={(selectedValues) => {
                              setFieldValue('mediaType', selectedValues);
                              setSelectedMediaTypes(selectedValues);
                            }}
                            value={[...(values.mediaType || []), ...(initialValues?.mediaType || [])]}
                            selectedValuesSearchHits={previouslySelectedMediaTypes ?? []}
                            querySearchHits={mediaTypes ?? []}
                            formikValues={initialValues?.mediaType ?? []}
                            loading={loadingSelectedMediaTypes || searchingMediaTypes}
                            portal={false}
                            showCodeAsDescription={true}
                          />
                        </Fieldset>
                      </ToggleFieldButton>

                      {distributionType === 'distribution' && (
                        <>
                          <FieldsetDivider />
                          <ToggleFieldButton
                            fieldName='license'
                            hasDeleteButton
                            fieldValues={values?.license}
                          >
                            <Fieldset
                              size='sm'
                              legend={
                                <TitleWithHelpTextAndTag
                                  tagTitle={localization.tag.recommended}
                                  tagColor='info'
                                  helpText={localization.datasetForm.helptext.license}
                                >
                                  {localization.datasetForm.fieldLabel.license}
                                </TitleWithHelpTextAndTag>
                              }
                            >
                              <Combobox
                                // @ts-expect-error: uri exists on the object
                                value={values?.license?.uri ? [values?.license.uri] : []}
                                portal={false}
                                onValueChange={(selectedValues) =>
                                  setFieldValue('license.uri', selectedValues.toString())
                                }
                                size='sm'
                                virtual
                              >
                                {openLicenses &&
                                  openLicenses.map((license, i) => (
                                    <Combobox.Option
                                      key={`license-${license.uri}-${i}`}
                                      value={license.uri}
                                    >
                                      {getTranslateText(license.label)}
                                    </Combobox.Option>
                                  ))}
                              </Combobox>
                            </Fieldset>
                          </ToggleFieldButton>
                        </>
                      )}

                      <FieldsetDivider />

                      <FormikLanguageFieldset
                        as={TextareaWithPrefix}
                        legend={
                          <TitleWithHelpTextAndTag
                            helpText={localization.datasetForm.helptext.distributionDescription}
                            tagColor='info'
                            tagTitle={localization.tag.recommended}
                          >
                            {localization.description}
                          </TitleWithHelpTextAndTag>
                        }
                        name='description'
                      />

                      <ToggleFieldButton
                        fieldName='page'
                        hasDeleteButton
                        fieldValues={values?.page}
                      >
                        <FastField
                          label={
                            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.page}>
                              {localization.datasetForm.fieldLabel.page}
                            </TitleWithHelpTextAndTag>
                          }
                          as={Textfield}
                          name='page[0].uri'
                          size='sm'
                          // @ts-expect-error: uri exists on the object
                          error={errors?.page?.[0]?.uri}
                        />
                      </ToggleFieldButton>

                      {distributionType === 'distribution' && (
                        <>
                          <FieldsetDivider />

                          <Fieldset
                            size='sm'
                            legend={
                              <TitleWithHelpTextAndTag
                                helpText={localization.datasetForm.helptext.distributionConformsTo}
                              >
                                {localization.datasetForm.fieldLabel.conformsTo}
                              </TitleWithHelpTextAndTag>
                            }
                          >
                            <FieldArray name='conformsTo'>
                              {({ push, remove }) => (
                                <>
                                  {values.conformsTo?.map((_, i) => (
                                    <div
                                      className={styles.add}
                                      key={`conformsTo-${i}`}
                                    >
                                      <Card>
                                        <div>
                                          <FormikLanguageFieldset
                                            legend={localization.title}
                                            as={Textfield}
                                            name={`conformsTo[${i}].prefLabel`}
                                          />
                                        </div>
                                        <FastField
                                          size='sm'
                                          as={Textfield}
                                          label={localization.link}
                                          name={`conformsTo[${i}].uri`}
                                          // @ts-expect-error: uri exists on the object
                                          error={errors?.conformsTo?.[i]?.uri}
                                        />
                                      </Card>
                                      <div>
                                        <DeleteButton onClick={() => remove(i)} />
                                      </div>
                                    </div>
                                  ))}
                                  <AddButton onClick={() => push({ uri: '' })}>
                                    {localization.datasetForm.button.addStandard}
                                  </AddButton>
                                </>
                              )}
                            </FieldArray>
                          </Fieldset>
                        </>
                      )}
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
            );
          }}
        </Formik>
      </Modal.Dialog>
    </Modal.Root>
  );
};
