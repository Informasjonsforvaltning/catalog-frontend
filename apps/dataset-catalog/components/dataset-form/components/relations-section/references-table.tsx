import { Dataset, Reference, Search } from '@catalog-frontend/types';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Box, Button, Combobox, Modal, Table } from '@digdir/designsystemet-react';
import { useSearchDatasetsByUri, useSearchDatasetSuggestions } from '../../../../hooks/useSearchService';
import { Formik, useFormikContext } from 'formik';
import relations from '../../utils/relations.json';
import { AddButton, DeleteButton, EditButton, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { useState, useRef, useEffect } from 'react';
import { referenceSchema } from '../../utils/validation-schema';
import { compact, isEmpty } from 'lodash';
import styles from '../../dataset-form.module.css';
import cn from 'classnames';
import { searchResourcesWithFilter } from '@catalog-frontend/data-access';

type Props = {
  searchEnv: string;
};

type ModalProps = {
  searchEnv: string;
  type: 'new' | 'edit';
  onSuccess: (values: Reference) => void;
  template: Reference;
  selectedUri: string | undefined;
};

const hasNoFieldValues = (values: Reference) => {
  if (!values) return true;
  return isEmpty(values?.referenceType?.code) && isEmpty(values?.source?.uri);
};

export const ReferenceTable = ({ searchEnv }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  const getUriList = () => {
    return values.references?.map((reference) => reference?.source?.uri).filter((uri) => uri) ?? [];
  };

  const { data: selectedValues } = useSearchDatasetsByUri(searchEnv, getUriList());

  return (
    <Box className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.references}>
        {localization.datasetForm.fieldLabel.references}
      </TitleWithHelpTextAndTag>
      {values?.references && compact(values?.references).length > 0 && (
        <Table
          size='sm'
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
                    {getTranslateText(relations.find((rel) => rel.code === ref?.referenceType?.code)?.label) ??
                      ref?.referenceType?.code}
                  </Table.Cell>
                  <Table.Cell>
                    {getTranslateText(selectedValues?.find((item) => item.uri === ref?.source?.uri)?.title) ??
                      ref?.source?.uri}
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.set}>
                      <FieldModal
                        searchEnv={searchEnv}
                        template={ref}
                        type={'edit'}
                        onSuccess={(updatedItem: Reference) => setFieldValue(`references[${index}]`, updatedItem)}
                        selectedUri={ref?.source?.uri}
                      />
                      <DeleteButton onClick={() => setFieldValue(`references[${index}]`, undefined)} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      )}

      <div>
        <FieldModal
          searchEnv={searchEnv}
          template={{ source: { uri: '' }, referenceType: { code: '' } }}
          type={'new'}
          onSuccess={(formValues) =>
            setFieldValue(
              values.references && values?.references.length > 0 && !hasNoFieldValues(values?.references?.[0])
                ? `references[${values?.references?.length}]`
                : `references[0]`,
              formValues,
            )
          }
          selectedUri={undefined}
        />
      </div>
    </Box>
  );
};

const FieldModal = ({ template, type, onSuccess, searchEnv, selectedUri }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  setInterval(() => {
    setModalIsOpen(modalRef?.current?.open ?? false);
  }, 300);

  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchHits, isLoading: searching } = useSearchDatasetSuggestions(searchEnv, searchQuery);

  const [selectedValues, setSelectedValues] = useState<Search.SearchObject[]>([]);
  const [comboboxOptions, setComboboxOptions] = useState<any[]>([]);

  useEffect(() => {
    const updatePreviouslySelectedAccessServices = async () => {
      if (selectedUri && !isEmpty(selectedUri)) {
        const searchOperation: Search.SearchOperation = {
          filters: { uri: { value: [selectedUri] } },
          pagination: { page: 0, size: 100 },
        };
        const res = await searchResourcesWithFilter(searchEnv, 'datasets', searchOperation);
        const data = await res.json();
        setSelectedValues(data.hits as Search.SearchObject[]);
      }
    };

    if (modalIsOpen) {
      updatePreviouslySelectedAccessServices();
    }
  }, [modalIsOpen]);

  useEffect(() => {
    const titleFromSearch = searchHits?.find((item: { uri: string }) => item.uri === selectedUri)?.title;
    const titleFromSelected = selectedValues?.find((item) => item.uri === selectedUri)?.title;
    const uriOption = selectedUri
      ? [
          {
            uri: selectedUri,
            title: titleFromSearch ?? titleFromSelected ?? undefined,
          },
        ]
      : [];
    setComboboxOptions([
      ...new Map(
        [...(searchHits ?? []), ...(selectedValues ?? []), ...uriOption]
          .filter(Boolean)
          .map((option) => [option.uri, option]),
      ).values(),
    ]);
  }, [selectedValues, searchHits]);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === 'new' ? (
            <AddButton>{`${localization.add} ${localization.relation.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
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
            {({ errors, isSubmitting, submitForm, values, dirty, setFieldValue }) => (
              <>
                <Modal.Header closeButton={false}>
                  {type === 'edit'
                    ? `${localization.edit} ${localization.relation.toLowerCase()}`
                    : `${localization.add} ${localization.relation.toLowerCase()}`}
                </Modal.Header>

                <Modal.Content className={cn(styles.modalContent, styles.fieldContainer)}>
                  <Combobox
                    label={localization.datasetForm.fieldLabel.relationType}
                    onValueChange={(value) => setFieldValue(`referenceType.code`, value.toString())}
                    value={values.referenceType?.code ? [values.referenceType?.code] : []}
                    placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
                    portal={false}
                    size='sm'
                    error={errors?.referenceType?.code}
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

                  <Combobox
                    label={localization.datasetForm.fieldLabel.dataset}
                    onChange={(input: any) => setSearchQuery(input.target.value)}
                    onValueChange={(value) => {
                      setFieldValue(`source.uri`, value.toString());
                    }}
                    loading={searching}
                    value={values?.source?.uri ? [values?.source?.uri] : []}
                    placeholder={`${localization.search.search}...`}
                    portal={false}
                    size='sm'
                    error={errors?.source?.uri}
                  >
                    <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
                    {comboboxOptions?.map((dataset) => (
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
                    ))}
                  </Combobox>
                </Modal.Content>

                <Modal.Footer>
                  <Button
                    type='button'
                    disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
                    onClick={() => submitForm()}
                    size='sm'
                  >
                    {type === 'new' ? localization.add : localization.datasetForm.button.update}
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
          </Formik>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
