"use client";

import {
  Dataset,
  Reference,
  Search,
  StorageData,
} from "@catalog-frontend/types";
import {
  getTranslateText,
  localization,
  trimObjectWhitespace,
  DataStorage,
} from "@catalog-frontend/utils";
import {
  Button,
  Dialog,
  Fieldset,
  Heading,
  Table,
} from "@digdir/designsystemet-react";
import { Formik, FormikErrors, useFormikContext } from "formik";
import relations from "../../utils/relations.json";
import {
  AddButton,
  DeleteButton,
  EditButton,
  TitleWithHelpTextAndTag,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
  DialogActions,
  SearchSuggestionSelect,
  SingleSuggestionSelect,
  SuggestionSelectOption,
  useDebounce,
} from "@catalog-frontend/ui";
import { useMemo, useRef, useState, useEffect } from "react";
import { referenceSchema } from "../../utils/validation-schema";
import { compact, get, isEmpty } from "lodash";
import styles from "../../dataset-form.module.css";
import cn from "classnames";

type Props = {
  searchEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

type ModalProps = {
  searchEnv: string;
  type: "new" | "edit";
  onSuccess: (values: Reference) => void;
  onCancel: () => void;
  onChange: (values: Reference) => void;
  template: Reference;
  initialUri: string | undefined;
  initialDatasets: Search.SearchObject[];
};

type DatasetOption = {
  uri: string;
  title?: Search.Suggestion["title"] | Search.SearchObject["title"] | null;
  organization?:
    | Search.Suggestion["organization"]
    | Search.SearchObject["organization"]
    | null;
};

const relationTypeOptions: SuggestionSelectOption[] = relations.map(
  (relation) => ({
    value: relation.uri,
    label: getTranslateText(relation.label),
    description: `${relation.uriAsPrefix} (${relation.uri})`,
  }),
);

const getDatasetLabel = (option: DatasetOption) =>
  getTranslateText(option.title) || option.uri;

const hasNoFieldValues = (values: Reference) => {
  if (!values) return true;
  return isEmpty(values?.referenceType) && isEmpty(values?.source);
};

export const ReferenceTable = ({
  searchEnv,
  autoSaveId,
  autoSaveStorage,
}: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();

  const getUriList = () => {
    return (
      values.references
        ?.map((reference) => reference?.source)
        .filter((uri) => uri !== undefined) ?? []
    );
  };

  const { data: selectedValues } = useSearchDatasetsByUri(
    searchEnv,
    getUriList(),
  );

  const handleReferenceChange = (updatedRef: Reference, index: number) => {
    if (autoSaveStorage && autoSaveId) {
      autoSaveStorage.setSecondary("reference", {
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
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("reference");
    }
  };

  const handleReferenceSuccess = (updatedRef: Reference, index: number) => {
    setFieldValue(`references[${index}]`, updatedRef);

    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("reference");
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={localization.datasetForm.helptext.references}
      >
        {localization.datasetForm.fieldLabel.references}
      </TitleWithHelpTextAndTag>
      {values?.references && compact(values?.references).length > 0 && (
        <div
          className={get(errors, "references") ? styles.errorBorder : undefined}
        >
          <Table data-size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.datasetForm.fieldLabel.relationType}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {localization.datasetForm.fieldLabel.dataset}
                </Table.HeaderCell>
                <Table.HeaderCell aria-label="Actions" />
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {values?.references &&
                values?.references.map((ref: Reference, index) => (
                  <Table.Row key={`references-${index}`}>
                    <Table.Cell>
                      {relations.find((rel) => rel.uri === ref?.referenceType)
                        ?.label
                        ? getTranslateText(
                            relations.find(
                              (rel) => rel.uri === ref?.referenceType,
                            )?.label,
                          )
                        : ref?.referenceType}
                    </Table.Cell>
                    <Table.Cell>
                      {getTranslateText(
                        selectedValues?.find((item) => item.uri === ref?.source)
                          ?.title,
                      ) ?? ref?.source}
                    </Table.Cell>
                    <Table.Cell>
                      <div className={styles.set}>
                        <FieldModal
                          searchEnv={searchEnv}
                          template={ref}
                          type="edit"
                          onSuccess={(updatedItem: Reference) => {
                            handleReferenceSuccess(updatedItem, index);
                          }}
                          onCancel={handleReferenceCancel}
                          onChange={(updatedItem: Reference) =>
                            handleReferenceChange(updatedItem, index)
                          }
                          initialUri={ref?.source}
                          initialDatasets={selectedValues ?? []}
                        />
                        <DeleteButton
                          onClick={() => {
                            const newArray = [...(values.references ?? [])];
                            newArray.splice(index, 1);
                            setFieldValue("references", newArray);
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
          template={{ source: "", referenceType: "" }}
          type="new"
          onSuccess={(updatedItem: Reference) => {
            const newIndex = values.references?.length ?? 0;
            setFieldValue(`references[${newIndex}]`, updatedItem);
            if (autoSaveStorage) {
              autoSaveStorage.deleteSecondary("reference");
            }
          }}
          onCancel={handleReferenceCancel}
          onChange={(updatedItem: Reference) => {
            const newIndex = values.references?.length ?? 0;
            if (autoSaveStorage && autoSaveId) {
              autoSaveStorage.setSecondary("reference", {
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
  initialDatasets,
}: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const modalRef = useRef<HTMLDialogElement>(null);

  const { data: searchHits, isFetching: searching } =
    useSearchDatasetSuggestions(searchEnv, debouncedSearchQuery);

  const resetLocalState = () => {
    setSearchQuery("");
    setSubmitted(false);
  };

  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger asChild>
          {type === "new" ? (
            <AddButton>{`${localization.add} ${localization.relation.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Dialog.Trigger>
        <Dialog
          ref={modalRef}
          onClose={() => {
            resetLocalState();
          }}
        >
          <Formik
            initialValues={template}
            enableReinitialize={true}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={referenceSchema}
            onSubmit={(formValues, { setSubmitting, resetForm }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              resetForm();
              resetLocalState();
              modalRef.current?.close();
            }}
          >
            {({
              errors,
              isSubmitting,
              submitForm,
              values,
              dirty,
              setFieldValue,
            }) => {
              useEffect(() => {
                if (dirty && modalRef.current?.open) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              return (
                <>
                  <Heading data-size="xs">
                    {type === "edit"
                      ? `${localization.edit} ${localization.relation.toLowerCase()}`
                      : `${localization.add} ${localization.relation.toLowerCase()}`}
                  </Heading>

                  <div
                    className={cn(styles.modalContent, styles.fieldContainer)}
                  >
                    <ReferenceFormFields
                      errors={errors}
                      initialDatasets={initialDatasets}
                      searchHits={searchHits}
                      searchQuery={searchQuery}
                      searching={searching}
                      setFieldValue={setFieldValue}
                      setSearchQuery={setSearchQuery}
                      values={values}
                    />
                  </div>

                  <DialogActions>
                    <Button
                      type="button"
                      disabled={
                        isSubmitting || !dirty || hasNoFieldValues(values)
                      }
                      onClick={() => submitForm()}
                      data-size="sm"
                    >
                      {type === "new" ? localization.add : localization.update}
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        onCancel();
                        modalRef.current?.close();
                      }}
                      disabled={isSubmitting}
                      data-size="sm"
                    >
                      {localization.button.cancel}
                    </Button>
                  </DialogActions>
                </>
              );
            }}
          </Formik>
        </Dialog>
      </Dialog.TriggerContext>
    </>
  );
};

type ReferenceFormFieldsProps = {
  errors: FormikErrors<Reference>;
  initialDatasets: Search.SearchObject[];
  searchHits?: Search.Suggestion[];
  searchQuery: string;
  searching: boolean;
  setFieldValue: (
    field: keyof Reference,
    value: Reference[keyof Reference],
  ) => void;
  setSearchQuery: (value: string) => void;
  values: Reference;
};

const ReferenceFormFields = ({
  errors,
  initialDatasets,
  searchHits,
  searchQuery,
  searching,
  setFieldValue,
  setSearchQuery,
  values,
}: ReferenceFormFieldsProps) => {
  const datasetOptionsList: DatasetOption[] = useMemo(() => {
    const resolveDataset = (uri: string): DatasetOption =>
      initialDatasets.find((dataset) => dataset.uri === uri) ||
      searchHits?.find((dataset) => dataset.uri === uri) || {
        uri,
      };

    const selectedItem = values.source ? resolveDataset(values.source) : null;
    const searchResults = searchQuery.trim() ? (searchHits ?? []) : [];

    return Array.from(
      new Map(
        [...(selectedItem ? [selectedItem] : []), ...searchResults]
          .filter((item) => Boolean(item.uri))
          .map((item) => [item.uri, item] as const),
      ).values(),
    );
  }, [initialDatasets, searchHits, searchQuery, values.source]);

  const datasetSuggestionOptions: SuggestionSelectOption[] = useMemo(
    () =>
      datasetOptionsList.map((option) => ({
        value: option.uri,
        label: getDatasetLabel(option),
      })),
    [datasetOptionsList],
  );

  const datasetEmptyMessage = searching
    ? `${localization.loading}...`
    : searchQuery.trim()
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const resolvedReferenceTypeUri = values.referenceType
    ? (relations.find((r) => r.uri === values.referenceType)?.uri ??
      values.referenceType)
    : undefined;

  const referenceTypeValue =
    resolvedReferenceTypeUri &&
    relations.some((r) => r.uri === resolvedReferenceTypeUri)
      ? resolvedReferenceTypeUri
      : undefined;

  return (
    <>
      <SingleSuggestionSelect
        emptyMessage={localization.search.noHits}
        error={errors?.referenceType}
        fieldsetLegend={localization.datasetForm.fieldLabel.relationType}
        onValueChange={(value) => setFieldValue("referenceType", value ?? "")}
        options={relationTypeOptions}
        placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
        value={referenceTypeValue}
      />

      <Fieldset data-size="sm">
        <Fieldset.Legend>
          {localization.datasetForm.fieldLabel.dataset}
        </Fieldset.Legend>
        <SearchSuggestionSelect
          emptyMessage={datasetEmptyMessage}
          error={errors?.source}
          isFetching={searching}
          onSearch={setSearchQuery}
          onValueChange={(value) => {
            setFieldValue("source", value ?? "");
            if (!value) {
              setSearchQuery("");
            }
          }}
          options={datasetSuggestionOptions}
          placeholder={`${localization.search.search}...`}
          renderOption={(option) => {
            const dataset = datasetOptionsList.find(
              (item) => item.uri === option.value,
            );

            return (
              <div className={styles.comboboxOptionTwoColumns}>
                <div>
                  {dataset?.title
                    ? getTranslateText(dataset.title)
                    : option.label}
                </div>
                <div>
                  {getTranslateText(dataset?.organization?.prefLabel) ?? ""}
                </div>
              </div>
            );
          }}
          value={values.source || undefined}
        />
      </Fieldset>
    </>
  );
};
