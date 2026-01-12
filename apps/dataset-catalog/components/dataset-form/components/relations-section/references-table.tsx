import { Dataset, Reference, Search, StorageData } from '@catalog-frontend/types';
import { getTranslateText, localization, trimObjectWhitespace, DataStorage } from '@catalog-frontend/utils';
import { Button, Combobox, Dialog, Fieldset, Heading, Table } from '@digdir/designsystemet-react';
import { HStack, VStack } from '@fellesdatakatalog/ui';
import { useSearchDatasetsByUri, useSearchDatasetSuggestions } from '../../../../hooks/useSearchService';
import { Formik, useFormikContext } from 'formik';
import relations from '../../utils/relations.json';
import { AddButton, DeleteButton, EditButton, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { useState, useRef, useEffect } from 'react';
import { referenceSchema } from '../../utils/validation-schema';
import { compact, get, isEmpty } from 'lodash';
import styles from '../../dataset-form.module.css';
import cn from 'classnames';

type Props = {
  searchEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

type ModalProps = {
  searchEnv: string;
  type: 'new' | 'edit';
  onSuccess: (values: Reference) => void;
  onCancel: () => void;
  onChange: (values: Reference) => void;
  template: Reference;
  initialUri: string | undefined;
  initialDatasets: Search.SearchObject[];
};

const hasNoFieldValues = (values: Reference) => {
  if (!values) return true;
  return isEmpty(values?.referenceType) && isEmpty(values?.source);
};

export const ReferenceTable = ({ searchEnv, autoSaveId, autoSaveStorage }: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();

  const getUriList = () => {
    return values.references?.map((reference) => reference?.source).filter((uri) => uri !== undefined) ?? [];
  };

  const { data: selectedValues } = useSearchDatasetsByUri(searchEnv, getUriList());

  const handleReferenceChange = (updatedRef: Reference, index: number) => {
    // Save to secondary storage for auto-save
    if (autoSaveStorage && autoSaveId) {
      autoSaveStorage.setSecondary('reference', {
        id: autoSaveId,
        values: {
          reference: updatedRef,
          index,
        },
        lastChanged: new Date().toISOString(),
      });
    }
  };

  const handleReferenceCancel = () => {
    // Clean up secondary storage on cancel
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary('reference');
    }
  };

  const handleReferenceSuccess = (updatedRef: Reference, index: number) => {
    setFieldValue(`references[${index}]`, updatedRef);

    // Clean up secondary storage on success
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary('reference');
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.references}>
        {localization.datasetForm.fieldLabel.references}
      </TitleWithHelpTextAndTag>
      {values?.references && compact(values?.references).length > 0 && (
        <div className={get(errors, `references`) ? styles.errorBorder : undefined}>
          <Table
            data-size='sm'
            className={styles.table}
          >
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>{localization.datasetForm.fieldLabel.relationType}</Table.HeaderCell>
                <Table.HeaderCell>{localization.datasetForm.fieldLabel.dataset}</Table.HeaderCell>
                <Table.HeaderCell aria-label='Actions' />
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {values?.references &&
                values?.references.map((ref: Reference, index) => (
                  <Table.Row key={`references-${index}`}>
                    <Table.Cell>
                      {getTranslateText(relations.find((rel) => rel.code === ref?.referenceType)?.label) ??
                        ref?.referenceType}
                    </Table.Cell>
                    <Table.Cell>
                      {getTranslateText(selectedValues?.find((item) => item.uri === ref?.source)?.title) ?? ref?.source}
                    </Table.Cell>
                    <Table.Cell>
                      <div className={styles.set}>
                        <FieldModal
                          searchEnv={searchEnv}
                          template={ref}
                          type={'edit'}
                          onSuccess={(updatedItem: Reference) => {
                            handleReferenceSuccess(updatedItem, index);
                          }}
                          onCancel={handleReferenceCancel}
                          onChange={(updatedItem: Reference) => handleReferenceChange(updatedItem, index)}
                          initialUri={ref?.source}
                          initialDatasets={selectedValues ?? []}
                        />
                        <DeleteButton
                          onClick={() => {
                            const newArray = [...(values.references ?? [])];
                            newArray.splice(index, 1);
                            setFieldValue('references', newArray);
                          }}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      )}
      <div>
        <FieldModal
          searchEnv={searchEnv}
          template={{ source: '', referenceType: '' }}
          type={'new'}
          onSuccess={(updatedItem: Reference) => {
            const newIndex = values.references?.length ?? 0;
            setFieldValue(`references[${newIndex}]`, updatedItem);
            if (autoSaveStorage) {
              autoSaveStorage.deleteSecondary('reference');
            }
          }}
          onCancel={handleReferenceCancel}
          onChange={(updatedItem: Reference) => {
            const newIndex = values.references?.length ?? 0;
            // Save to secondary storage for auto-save
            if (autoSaveStorage && autoSaveId) {
              autoSaveStorage.setSecondary('reference', {
                id: autoSaveId,
                values: {
                  reference: updatedItem,
                  index: newIndex,
                },
                lastChanged: new Date().toISOString(),
              });
            }
          }}
          initialUri={undefined}
          initialDatasets={[]}
        />
      </div>
    </div>
  );
};

const FieldModal = ({
  template,
  type,
  onSuccess,
  onCancel,
  onChange,
  searchEnv,
  initialUri,
  initialDatasets,
}: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedUri, setSelectedUri] = useState(initialUri);

  const modalRef = useRef<HTMLDialogElement>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchHits, isLoading: searching } = useSearchDatasetSuggestions(searchEnv, searchQuery);

  const [selectedValue, setSelectedValue] = useState<Search.SearchObject | undefined>();
  const [comboboxOptions, setComboboxOptions] = useState<any[]>([]);

  useEffect(() => {
    const allDatasets = [...(searchHits ?? []), ...initialDatasets, ...(selectedValue ? [selectedValue] : [])];
    setSelectedValue(allDatasets.find((dataset) => dataset.uri === selectedUri));
  }, [selectedUri, searchHits, initialDatasets]);

  useEffect(() => {
    const titleFromSearch = searchHits?.find((item: { uri: string }) => item.uri === selectedUri)?.title;
    const titleFromSelected = selectedValue?.title;
    const uriOption = selectedUri
      ? [
          {
            uri: selectedUri,
            title: titleFromSearch ?? titleFromSelected ?? undefined,
          },
        ]
      : [];
    const options = [
      ...new Map(
        [...(searchHits ?? []), ...[selectedValue], ...uriOption].filter(Boolean).map((option) => [option.uri, option]),
      ).values(),
    ];
    setComboboxOptions(options);
  }, [selectedValue, searchHits]);

  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === 'new' ? (
            <AddButton>{`${localization.add} ${localization.relation.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Dialog.Trigger>
        <Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={referenceSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ errors, isSubmitting, submitForm, values, dirty, setFieldValue }) => {
              useEffect(() => {
                if (dirty) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              return (
                <>
                  <Dialog.Block>
                    <Heading level={2} data-size='xs'>
                      {type === 'edit'
                        ? `${localization.edit} ${localization.relation.toLowerCase()}`
                        : `${localization.add} ${localization.relation.toLowerCase()}`}
                    </Heading>
                  </Dialog.Block>

                  <Dialog.Block>
                    <VStack>
                      <Fieldset data-size='sm'>
                        <Fieldset.Legend>{localization.datasetForm.fieldLabel.relationType}</Fieldset.Legend>
                        <Combobox
                          onValueChange={(value) => setFieldValue(`referenceType`, value.toString())}
                          value={values.referenceType ? [values.referenceType] : []}
                          placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
                          portal={false}
                          data-size='sm'
                          error={errors?.referenceType}
                          virtual
                        >
                          <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
                          {relations.map((relation) => (
                            <Combobox.Option
                              key={relation?.code}
                              value={relation?.code}
                              description={`${relation?.uriAsPrefix} (${relation?.uri})`}
                            >
                              {getTranslateText(relation?.label)}
                            </Combobox.Option>
                          ))}
                        </Combobox>
                      </Fieldset>

                      <Fieldset data-size='sm'>
                        <Fieldset.Legend>{localization.datasetForm.fieldLabel.dataset}</Fieldset.Legend>
                        <Combobox
                          onChange={(input: any) => setSearchQuery(input.target.value)}
                          onValueChange={(value) => {
                            setSelectedUri(value.toString());
                            setFieldValue(`source`, value.toString());
                          }}
                          loading={searching}
                          value={values?.source && !isEmpty(values.source) ? [values.source] : []}
                          placeholder={`${localization.search.search}...`}
                          portal={false}
                          data-size='sm'
                          error={errors?.source}
                        >
                          <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
                          {comboboxOptions?.map((dataset) => {
                            return (
                              <Combobox.Option
                                key={dataset.uri}
                                value={dataset.uri}
                                displayValue={dataset.title ? getTranslateText(dataset.title) : dataset.uri}
                              >
                                <div className={styles.comboboxOptionTwoColumns}>
                                  <div>{dataset.title ? getTranslateText(dataset.title) : dataset.uri}</div>
                                  <div>{getTranslateText(dataset.organization?.prefLabel) ?? ''}</div>
                                </div>
                              </Combobox.Option>
                            );
                          })}
                        </Combobox>
                      </Fieldset>
                    </VStack>
                  </Dialog.Block>

                  <Dialog.Block>
                    <HStack>
                      <Button
                        type='button'
                        disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
                        onClick={() => submitForm()}
                        data-size='sm'
                      >
                        {type === 'new' ? localization.add : localization.datasetForm.button.update}
                      </Button>
                      <Button
                        variant='secondary'
                        type='button'
                        onClick={() => {
                          onCancel();
                          modalRef.current?.close();
                        }}
                        disabled={isSubmitting}
                        data-size='sm'
                      >
                        {localization.button.cancel}
                      </Button>
                    </HStack>
                  </Dialog.Block>
                </>
              );
            }}
          </Formik>
        </Dialog>
      </Dialog.TriggerContext>
    </>
  );
};
