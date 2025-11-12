'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Distribution, ReferenceDataCode, Search } from '@catalog-frontend/types';
import {
  AddButton,
  DeleteButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormikReferenceDataCombobox,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  FastFieldWithRef,
} from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Card, Combobox, Fieldset, Modal, SkeletonRectangle, Textfield } from '@digdir/designsystemet-react';
import { useSearchFileTypes, useSearchMediaTypes } from '../../../../hooks/useReferenceDataSearch';
import { useSearchDataServiceSuggestions } from '../../../../hooks/useSearchService';
import { FastField, FieldArray, Formik } from 'formik';
import styles from './distributions.module.scss';
import { distributionTemplate } from '../../utils/dataset-initial-values';
import { distributionSectionSchema } from '../../utils/validation-schema';
import { ToggleFieldButton } from '@dataset-catalog/components/dataset-form/components/toggle-field-button';
import { get, isArray, isEmpty, isNil, isObject } from 'lodash';
import FieldsetWithDelete from '@dataset-catalog/components/fieldset-with-delete';

type Props = {
  trigger: ReactNode;
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses?: ReferenceDataCode[];
  onSuccess: (values: Distribution) => void;
  onCancel?: () => void;
  onChange?: (values: Distribution) => void;
  initialValues: Partial<Distribution> | undefined;
  initialFileTypes: ReferenceDataCode[];
  initialMediaTypes: ReferenceDataCode[];
  initialAccessServices: Search.SearchObject[];
  type: 'new' | 'edit';
  distributionType: 'distribution' | 'sample';
};

export const DistributionModal = ({
  referenceDataEnv,
  searchEnv,
  openLicenses,
  onSuccess,
  onCancel,
  onChange,
  trigger,
  initialValues,
  initialFileTypes,
  initialMediaTypes,
  initialAccessServices,
  type,
  distributionType,
}: Props) => {
  const [selectedFileTypeUris, setSelectedFileTypeUris] = useState(initialValues?.format ?? []);
  const [selectedMediaTypeUris, setSelectedMediaTypeUris] = useState(initialValues?.mediaType ?? []);
  const [selectedAccessServiceUris, setSelectedAccessServiceUris] = useState(initialValues?.accessServices ?? []);
  const [selectedAndSearchedFileTypes, setSelectedAndSearchedFileTypes] = useState<ReferenceDataCode[]>([]);
  const [selectedAndSearchedMediaTypes, setSelectedAndSearchedMediaTypes] = useState<ReferenceDataCode[]>([]);
  const [selectedAndSearchedAccessServices, setSelectedAndSearchedAccessServices] = useState<Search.SearchObject[]>([]);

  const template = distributionTemplate(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [searchQueryMediaTypes, setSearchQueryMediaTypes] = useState<string>('');
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');
  const [searchDataServicesQuery, setSearchDataServicesQuery] = useState<string>('');

  const [focus, setFocus] = useState<string | null>();
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const setInputRef = (fieldName: string, element: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRefs.current[fieldName] = element;
  };

  const { data: mediaTypes, isLoading: searchingMediaTypes } = useSearchMediaTypes(
    searchQueryMediaTypes,
    referenceDataEnv,
  );
  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);
  const { data: dataServices } = useSearchDataServiceSuggestions(searchEnv, searchDataServicesQuery);

  if (initialValues?.accessURL?.length === 0) {
    initialValues.accessURL = [''];
  }

  useEffect(() => {
    const allMediaTypes = [...selectedAndSearchedMediaTypes, ...initialMediaTypes];
    const selectedMediaTypes = selectedMediaTypeUris
      ?.map((uri) => allMediaTypes.find((mediaType) => mediaType.uri === uri))
      .filter((mediaType) => mediaType !== undefined);
    const unique = Array.from(
      new Map([...(selectedMediaTypes ?? []), ...(mediaTypes ?? [])].map((item) => [item.uri, item])).values(),
    );
    setSelectedAndSearchedMediaTypes(unique);
  }, [mediaTypes, selectedMediaTypeUris, initialMediaTypes, setSelectedAndSearchedMediaTypes]);

  useEffect(() => {
    const allFileTypes = [...selectedAndSearchedFileTypes, ...initialFileTypes];
    const selectedFileTypes = selectedFileTypeUris
      ?.map((uri) => allFileTypes.find((fileType) => fileType.uri === uri))
      .filter((fileType) => fileType !== undefined);
    const unique = Array.from(
      new Map([...(selectedFileTypes ?? []), ...(fileTypes ?? [])].map((item) => [item.uri, item])).values(),
    );
    setSelectedAndSearchedFileTypes(unique);
  }, [fileTypes, selectedFileTypeUris, initialFileTypes, setSelectedAndSearchedFileTypes]);

  useEffect(() => {
    const allAccessServices = [...selectedAndSearchedAccessServices, ...initialAccessServices];
    const selectedAccessServices = selectedAccessServiceUris
      ?.map((uri) => allAccessServices.find((service) => service.uri === uri))
      .filter((service) => service !== undefined);
    const unique = Array.from(
      new Map([...(selectedAccessServices ?? []), ...(dataServices ?? [])].map((item) => [item.uri, item])).values(),
    );
    setSelectedAndSearchedAccessServices(unique);
  }, [dataServices, selectedAccessServiceUris, initialAccessServices, setSelectedAndSearchedAccessServices]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    modalRef.current?.close();
  };

  const handleSubmit = (values: Distribution, { setSubmitting }: any) => {
    const trimmedValues = trimObjectWhitespace(values);
    onSuccess(trimmedValues);
    setSubmitting(false);
    setSubmitted(true);
    modalRef.current?.close();
  };

  const FIELD_CONFIG = [
    {
      name: 'downloadURL',
      getValue: (values: Distribution) => values?.downloadURL,
      render: (props: any) => (
        <FieldArray name='downloadURL'>
          {(arrayHelpers) => (
            <>
              {(arrayHelpers.form.values.downloadURL || []).map((_: any, index: number, array: string[]) => (
                <React.Fragment key={`downloadURL-${index}`}>
                  <div className={styles['padding-bottom-4']}>
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <FastFieldWithRef
                        name={`downloadURL[${index}]`}
                        ref={(el: HTMLInputElement | HTMLTextAreaElement | null) =>
                          props.setInputRef(`downloadURL[${index}]`, el)
                        }
                        label={
                          index === 0 ? (
                            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.downloadURL}>
                              {localization.datasetForm.fieldLabel.downloadURL}
                            </TitleWithHelpTextAndTag>
                          ) : (
                            ''
                          )
                        }
                        as={Textfield}
                        data-size='sm'
                        error={props.errors?.downloadURL?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                </React.Fragment>
              ))}
              <AddButton
                onClick={() => {
                  arrayHelpers.push('');
                  props.setFocus(
                    arrayHelpers.form.values.downloadURL
                      ? `downloadURL[${arrayHelpers.form.values.downloadURL.length}]`
                      : `downloadURL[0]`,
                  );
                }}
              >
                {`${localization.add} ${localization.datasetForm.fieldLabel.downloadURL.toLowerCase()}`}
              </AddButton>
              {props.showDivider && <FieldsetDivider />}
            </>
          )}
        </FieldArray>
      ),
      hasDeleteButton: false,
      hideToggleButton: true,
    },
    {
      name: 'accessServices',
      shouldShow: ({ distributionType }: any) => distributionType === 'distribution',
      render: ({
        setFieldValue,
        setSelectedAccessServiceUris,
        setSearchDataServicesQuery,
        selectedAndSearchedAccessServices,
      }: any) => (
        <Fieldset
          data-size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.accessServices}>
              {localization.datasetForm.fieldLabel.accessServices}
            </TitleWithHelpTextAndTag>
          }
        >
          {selectedAccessServiceUris?.every((v) =>
            selectedAndSearchedAccessServices.find((option: { uri: string }) => option.uri === v),
          ) ? (
            <FieldsetWithDelete onDelete={() => setFieldValue('accessServices', null)}>
              <Combobox
                multiple
                hideClearButton
                portal={false}
                onChange={(event) => setSearchDataServicesQuery(event.target.value)}
                value={selectedAccessServiceUris}
                onValueChange={(selectedValues) => {
                  setFieldValue('accessServices', selectedValues);
                  setSelectedAccessServiceUris(selectedValues);
                }}
                placeholder={`${localization.search.search}...`}
                data-size='sm'
                virtual
                ref={(el: HTMLInputElement | null) => setInputRef(`accessServices`, el)}
              >
                {selectedAndSearchedAccessServices.map(
                  (option: { uri: any; description: any; title: any; organization: { prefLabel: any } }, i: any) => (
                    <Combobox.Option
                      key={`distribution-${option.uri}-${i}`}
                      value={option.uri ?? option.description}
                      displayValue={(getTranslateText(option.title) as string) ?? option.uri}
                    >
                      <div className={styles.comboboxOptionTwoColumns}>
                        <div>
                          {option.title ? getTranslateText(option.title) : getTranslateText(option.description)}
                        </div>
                        <div>{getTranslateText(option.organization?.prefLabel) ?? ''}</div>
                      </div>
                    </Combobox.Option>
                  ),
                )}
              </Combobox>
            </FieldsetWithDelete>
          ) : (
            <SkeletonRectangle />
          )}
        </Fieldset>
      ),
    },
    {
      name: 'mediaType',
      render: ({
        setFieldValue,
        setSelectedMediaTypeUris,
        setSearchQueryMediaTypes,
        initialValues,
        selectedAndSearchedMediaTypes,
        mediaTypes,
        searchingMediaTypes,
      }: any) => (
        <Fieldset
          data-size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.mediaType}>
              {localization.datasetForm.fieldLabel.mediaType}
            </TitleWithHelpTextAndTag>
          }
        >
          {selectedMediaTypeUris?.every((v) =>
            selectedAndSearchedMediaTypes?.find((option: ReferenceDataCode | undefined) => option?.uri === v),
          ) ? (
            <FieldsetWithDelete onDelete={() => setFieldValue('mediaType', null)}>
              <FormikReferenceDataCombobox
                onChange={(event) => setSearchQueryMediaTypes(event.target.value)}
                onValueChange={(selectedValues) => {
                  setFieldValue('mediaType', selectedValues);
                  setSelectedMediaTypeUris(selectedValues);
                }}
                value={selectedMediaTypeUris}
                selectedValuesSearchHits={selectedAndSearchedMediaTypes ?? []}
                querySearchHits={mediaTypes ?? []}
                formikValues={initialValues?.mediaType ?? []}
                loading={searchingMediaTypes}
                portal={false}
                showCodeAsDescription={true}
                hideClearButton={false}
                ref={(el: HTMLInputElement | null) => setInputRef(`mediaType`, el)}
              />
            </FieldsetWithDelete>
          ) : (
            <SkeletonRectangle />
          )}
        </Fieldset>
      ),
    },
    {
      name: 'page',
      getValue: (values: Distribution) => values?.page,
      render: (props: any) => (
        <FieldArray name='page'>
          {(arrayHelpers) => (
            <>
              {(arrayHelpers.form.values.page || []).map((_: any, index: number) => (
                <React.Fragment key={`page-${index}`}>
                  <div className={styles['padding-bottom-4']}>
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <FastFieldWithRef
                        name={`page[${index}]`}
                        ref={(el: HTMLInputElement | HTMLTextAreaElement | null) =>
                          props.setInputRef(`page[${index}]`, el)
                        }
                        label={
                          index === 0 ? (
                            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.page}>
                              {localization.datasetForm.fieldLabel.page}
                            </TitleWithHelpTextAndTag>
                          ) : (
                            ''
                          )
                        }
                        as={Textfield}
                        data-size='sm'
                        error={props.errors?.page?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                </React.Fragment>
              ))}
              <AddButton
                onClick={() => {
                  arrayHelpers.push('');
                  props.setFocus(
                    arrayHelpers.form.values.page ? `page[${arrayHelpers.form.values.page.length}]` : `page[0]`,
                  );
                }}
              >
                {`${localization.add} ${localization.datasetForm.fieldLabel.page.toLowerCase()}`}
              </AddButton>
              {props.showDivider && <FieldsetDivider />}
            </>
          )}
        </FieldArray>
      ),
      hasDeleteButton: false,
      hideToggleButton: true,
    },
    {
      name: 'conformsTo',
      addValue: [{ prefLabel: { nb: '', nn: '' }, uri: '' }],
      shouldShow: ({ distributionType }: any) => distributionType === 'distribution',
      render: ({ errors }: any) => (
        <Fieldset
          data-size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.distributionConformsTo}>
              {localization.datasetForm.fieldLabel.conformsTo}
            </TitleWithHelpTextAndTag>
          }
        >
          <FieldArray name='conformsTo'>
            {({ push, remove, form }) => (
              <>
                {form.values.conformsTo?.map((_: any, i: number) => (
                  <div
                    className={styles.add}
                    key={`conformsTo-${i}`}
                  >
                    <Card>
                      <div>
                        <FormikLanguageFieldset
                          legend={
                            <TitleWithHelpTextAndTag
                              tagTitle={localization.tag.required}
                              tagColor='warning'
                            >
                              {localization.title}
                            </TitleWithHelpTextAndTag>
                          }
                          as={Textfield}
                          name={`conformsTo[${i}].prefLabel`}
                          ref={(el: HTMLInputElement | HTMLTextAreaElement | null) => setInputRef(`conformsTo`, el)}
                        />
                      </div>
                      <FastField
                        data-size='sm'
                        as={Textfield}
                        label={localization.link}
                        name={`conformsTo[${i}].uri`}
                        error={errors?.conformsTo?.[i]?.uri}
                      />
                    </Card>
                    <div>
                      <DeleteButton onClick={() => remove(i)} />
                    </div>
                  </div>
                ))}
                <AddButton
                  onClick={() => {
                    push({ prefLabel: { nb: '', nn: '' }, uri: '' });
                    setFocus(`conformsTo`);
                  }}
                >
                  {localization.datasetForm.button.addStandard}
                </AddButton>
              </>
            )}
          </FieldArray>
        </Fieldset>
      ),
    },
  ];

  useEffect(() => {
    if (focus && inputRefs.current[focus]) {
      inputRefs.current[focus]?.focus();
      setFocus(null);
    }
  }, [focus]);

  return (
    <Modal.Root>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        className={styles.dialog}
      >
        <Formik
          initialValues={{ ...template }}
          name='distribution'
          validateOnChange={submitted}
          validateOnBlur={submitted}
          validationSchema={distributionSectionSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, isSubmitting, submitForm, values, dirty, setFieldValue }) => {
            // Call onChange whenever values change for autosave
            useEffect(() => {
              if (dirty && onChange) {
                onChange(values);
              }
            }, [values, dirty, onChange]);

            const isExpanded = (fieldConfig: any) => {
              const fieldValues = get(values, fieldConfig.name);
              if (isArray(fieldValues)) return fieldValues.length > 0;
              if (isObject(fieldValues)) return !isEmpty(fieldValues);
              return !isNil(fieldValues);
            };

            // Helper to render a field
            const renderField = (fieldConfig: any, showDivider: boolean = false) => {
              const props = {
                selectedAndSearchedAccessServices,
                distributionType,
                expanded: isExpanded(fieldConfig),
                fileTypes,
                mediaTypes,
                selectedAndSearchedFileTypes,
                selectedAndSearchedMediaTypes,
                openLicenses,
                ref: (el: HTMLInputElement | HTMLTextAreaElement | null) => setInputRef(fieldConfig.name, el),
                searchingFileTypes,
                searchingMediaTypes,
                setFieldValue,
                setFocus,
                setInputRef,
                setSearchDataServicesQuery,
                setSearchQueryFileTypes,
                setSearchQueryMediaTypes,
                setSelectedAccessServiceUris,
                setSelectedFileTypeUris,
                setSelectedMediaTypeUris,
                showDivider,
                values,
                errors,
              };

              return fieldConfig.hideToggleButton ? (
                <div key={fieldConfig.name}>{fieldConfig.render(props)}</div>
              ) : (
                <ToggleFieldButton
                  key={fieldConfig.name}
                  fieldName={fieldConfig.name}
                  hasDeleteButton={fieldConfig.hasDeleteButton}
                  addValue={fieldConfig.addValue}
                  setFocus={setFocus}
                  expanded={isExpanded(fieldConfig)}
                  showDivider={showDivider && isExpanded(fieldConfig)}
                >
                  {fieldConfig.render(props)}
                </ToggleFieldButton>
              );
            };

            // Split fields into expanded and minimized
            const expandedFields = FIELD_CONFIG.filter((f) => isExpanded(f));
            const minimizedFields = FIELD_CONFIG.filter((f) => !isExpanded(f));

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
                      <FieldsetDivider />
                      <FieldArray name='accessURL'>
                        {(arrayHelpers) => (
                          <>
                            {(arrayHelpers.form.values.accessURL || []).map(
                              (_: any, index: number, array: string[]) => {
                                return (
                                  <React.Fragment key={`accessURL-${index}`}>
                                    <div>
                                      {index > 0 ? (
                                        <FieldsetWithDelete
                                          onDelete={() => arrayHelpers.remove(index)}
                                          style={{ marginTop: '1rem' }}
                                        >
                                          <FastFieldWithRef
                                            name={`accessURL[${index}]`}
                                            ref={(el: HTMLInputElement | HTMLTextAreaElement | null) =>
                                              setInputRef(`accessURL[${index}]`, el)
                                            }
                                            label={
                                              index === 0 ? (
                                                <TitleWithHelpTextAndTag
                                                  tagColor='warning'
                                                  tagTitle={localization.tag.required}
                                                  helpText={localization.datasetForm.helptext.accessURL}
                                                >
                                                  {localization.datasetForm.fieldLabel.accessURL}
                                                </TitleWithHelpTextAndTag>
                                              ) : (
                                                ''
                                              )
                                            }
                                            as={Textfield}
                                            data-size='sm'
                                            error={errors?.accessURL?.[index]}
                                          />
                                        </FieldsetWithDelete>
                                      ) : (
                                        <FastFieldWithRef
                                          name={`accessURL[${index}]`}
                                          ref={(el: HTMLInputElement | HTMLTextAreaElement | null) =>
                                            setInputRef(`accessURL[${index}]`, el)
                                          }
                                          label={
                                            index === 0 ? (
                                              <TitleWithHelpTextAndTag
                                                tagColor='warning'
                                                tagTitle={localization.tag.required}
                                                helpText={localization.datasetForm.helptext.accessURL}
                                              >
                                                {localization.datasetForm.fieldLabel.accessURL}
                                              </TitleWithHelpTextAndTag>
                                            ) : (
                                              ''
                                            )
                                          }
                                          as={Textfield}
                                          data-size='sm'
                                          error={errors?.accessURL?.[index]}
                                        />
                                      )}
                                    </div>
                                  </React.Fragment>
                                );
                              },
                            )}
                            <AddButton
                              onClick={() => {
                                arrayHelpers.push('');
                                setFocus(
                                  arrayHelpers.form.values.accessURL
                                    ? `accessURL[${arrayHelpers.form.values.accessURL.length}]`
                                    : `accessURL[0]`,
                                );
                              }}
                            >
                              {`${localization.datasetForm.fieldLabel.accessURL}`}
                            </AddButton>
                            <FieldsetDivider />
                          </>
                        )}
                      </FieldArray>
                      <Fieldset
                        data-size='sm'
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
                        {!selectedFileTypeUris ||
                        selectedFileTypeUris?.every((v) =>
                          selectedAndSearchedFileTypes?.find(
                            (option: ReferenceDataCode | undefined) => option?.uri === v,
                          ),
                        ) ? (
                          <FormikReferenceDataCombobox
                            onChange={(event) => setSearchQueryFileTypes(event.target.value)}
                            onValueChange={(selectedValues) => {
                              setFieldValue('format', selectedValues);
                              setSelectedFileTypeUris(selectedValues);
                            }}
                            value={selectedFileTypeUris}
                            selectedValuesSearchHits={selectedAndSearchedFileTypes ?? []}
                            querySearchHits={fileTypes ?? []}
                            formikValues={initialValues?.format ?? []}
                            loading={searchingFileTypes}
                            portal={false}
                            hideClearButton={false}
                            ref={(el: HTMLInputElement | null) => setInputRef(`format`, el)}
                          />
                        ) : (
                          <SkeletonRectangle />
                        )}
                      </Fieldset>
                      <FieldsetDivider />
                      {distributionType === 'distribution' && (
                        <>
                          <Fieldset
                            data-size='sm'
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
                              value={values?.license ? [values?.license] : ['']}
                              portal={false}
                              onValueChange={(selectedValues) => {
                                setFieldValue('license', selectedValues.toString());
                              }}
                              data-size='sm'
                              virtual
                            >
                              <Combobox.Option
                                key={`license-none`}
                                value={''}
                              >
                                {localization.none}
                              </Combobox.Option>
                              {openLicenses &&
                                openLicenses.map((license: any, i: number) => (
                                  <Combobox.Option
                                    key={`license-${license.uri}-${i}`}
                                    value={license.uri}
                                  >
                                    {getTranslateText(license.label)}
                                  </Combobox.Option>
                                ))}
                            </Combobox>
                          </Fieldset>
                          <FieldsetDivider />
                        </>
                      )}
                      {expandedFields.map((f, index) =>
                        renderField(f, !(minimizedFields.length === 0 && index === expandedFields.length - 1)),
                      )}
                      {minimizedFields.map((f) => renderField(f))}
                    </Modal.Content>

                    <Modal.Footer>
                      <Button
                        type='button'
                        disabled={isSubmitting}
                        onClick={() => submitForm()}
                        data-size='sm'
                      >
                        {type === 'new' ? localization.add : localization.datasetForm.button.updateDistribution}
                      </Button>
                      <Button
                        variant='secondary'
                        type='button'
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        data-size='sm'
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
