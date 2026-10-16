"use client";

import {
  InformationModel,
  ResourceRelation,
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
import relations from "../utils/relations.json";
import {
  AddButton,
  DeleteButton,
  EditButton,
  TitleWithHelpTextAndTag,
  useSearchInformationModelsByUri,
  useSearchInformationModelsSuggestions,
  DialogActions,
  SearchSuggestionSelect,
  SingleSuggestionSelect,
  SuggestionSelectOption,
  useDebounce,
} from "@catalog-frontend/ui";
import { useMemo, useRef, useState, useEffect } from "react";
import { resourceRelationSchema } from "../utils/validation-schema";
import { compact, get, isEmpty } from "lodash";
import styles from "../information-model-form.module.css";
import cn from "classnames";

type Props = {
  searchEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

type ModalProps = {
  searchEnv: string;
  type: "new" | "edit";
  onSuccess: (values: ResourceRelation) => void;
  onCancel: () => void;
  onChange: (values: ResourceRelation) => void;
  template: ResourceRelation;
  initialUri: string | undefined;
  initialInformationModels: Search.SearchObject[];
};

type InformationModelOption = {
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

const getInformationModelLabel = (option: InformationModelOption) =>
  getTranslateText(option.title) || option.uri;

const hasNoFieldValues = (values: ResourceRelation) => {
  if (!values) return true;
  return isEmpty(values?.type) && isEmpty(values?.source);
};

const getRelationTypeLabel = (typeUri: string | undefined) => {
  const match = relations.find((rel) => rel.uri === typeUri);
  return match?.label ? getTranslateText(match.label) : typeUri;
};

export const RelationsSection = ({
  searchEnv,
  autoSaveId,
  autoSaveStorage,
}: Props) => {
  const { values, errors, setFieldValue } =
    useFormikContext<InformationModel>();

  const getUriList = () => {
    return (
      values.relations
        ?.map((relation) => relation?.source)
        .filter((uri): uri is string => uri !== undefined) ?? []
    );
  };

  const { data: selectedValues } = useSearchInformationModelsByUri(
    searchEnv,
    getUriList(),
  );

  const handleRelationChange = (
    updatedRelation: ResourceRelation,
    index: number,
  ) => {
    if (autoSaveStorage && autoSaveId) {
      autoSaveStorage.setSecondary("relation", {
        id: autoSaveId,
        values: {
          relation: updatedRelation,
          index,
        },
        lastChanged: new Date().toISOString(),
      });
    }
  };

  const handleRelationCancel = () => {
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("relation");
    }
  };

  const handleRelationSuccess = (
    updatedRelation: ResourceRelation,
    index: number,
  ) => {
    setFieldValue(`relations[${index}]`, updatedRelation);

    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("relation");
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={localization.informationModelForm.helptext.relations}
      >
        {localization.informationModelForm.fieldLabel.relations}
      </TitleWithHelpTextAndTag>
      {values?.relations && compact(values?.relations).length > 0 && (
        <div
          className={get(errors, "relations") ? styles.errorBorder : undefined}
        >
          <Table data-size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.relationType}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {
                    localization.informationModelForm.fieldLabel
                      .informationModel
                  }
                </Table.HeaderCell>
                <Table.HeaderCell aria-label="Actions" />
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {values?.relations?.map((relation: ResourceRelation, index) => (
                <Table.Row key={`relations-${index}`}>
                  <Table.Cell>
                    {getRelationTypeLabel(relation?.type)}
                  </Table.Cell>
                  <Table.Cell>
                    {getTranslateText(
                      selectedValues?.find(
                        (item) => item.uri === relation?.source,
                      )?.title,
                    ) ?? relation?.source}
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.set}>
                      <FieldModal
                        searchEnv={searchEnv}
                        template={relation}
                        type="edit"
                        onSuccess={(updatedItem: ResourceRelation) => {
                          handleRelationSuccess(updatedItem, index);
                        }}
                        onCancel={handleRelationCancel}
                        onChange={(updatedItem: ResourceRelation) =>
                          handleRelationChange(updatedItem, index)
                        }
                        initialUri={relation?.source}
                        initialInformationModels={selectedValues ?? []}
                      />
                      <DeleteButton
                        onClick={() => {
                          const newArray = [...(values.relations ?? [])];
                          newArray.splice(index, 1);
                          setFieldValue("relations", newArray);
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
          template={{ source: "", type: "" }}
          type="new"
          onSuccess={(updatedItem: ResourceRelation) => {
            const newIndex = values.relations?.length ?? 0;
            setFieldValue(`relations[${newIndex}]`, updatedItem);
            if (autoSaveStorage) {
              autoSaveStorage.deleteSecondary("relation");
            }
          }}
          onCancel={handleRelationCancel}
          onChange={(updatedItem: ResourceRelation) => {
            const newIndex = values.relations?.length ?? 0;
            if (autoSaveStorage && autoSaveId) {
              autoSaveStorage.setSecondary("relation", {
                id: autoSaveId,
                values: {
                  relation: updatedItem,
                  index: newIndex,
                },
                lastChanged: new Date().toISOString(),
              });
            }
          }}
          initialUri={undefined}
          initialInformationModels={[]}
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
  initialInformationModels,
}: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const modalRef = useRef<HTMLDialogElement>(null);

  const { data: searchHits, isFetching: searching } =
    useSearchInformationModelsSuggestions(searchEnv, debouncedSearchQuery);

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
            validationSchema={resourceRelationSchema}
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
                    <RelationFormFields
                      errors={errors}
                      initialInformationModels={initialInformationModels}
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

type RelationFormFieldsProps = {
  errors: FormikErrors<ResourceRelation>;
  initialInformationModels: Search.SearchObject[];
  searchHits?: Search.Suggestion[];
  searchQuery: string;
  searching: boolean;
  setFieldValue: (
    field: keyof ResourceRelation,
    value: ResourceRelation[keyof ResourceRelation],
  ) => void;
  setSearchQuery: (value: string) => void;
  values: ResourceRelation;
};

const RelationFormFields = ({
  errors,
  initialInformationModels,
  searchHits,
  searchQuery,
  searching,
  setFieldValue,
  setSearchQuery,
  values,
}: RelationFormFieldsProps) => {
  const informationModelOptionsList: InformationModelOption[] = useMemo(() => {
    const resolveInformationModel = (uri: string): InformationModelOption =>
      initialInformationModels.find((model) => model.uri === uri) ||
      searchHits?.find((model) => model.uri === uri) || {
        uri,
      };

    const selectedItem = values.source
      ? resolveInformationModel(values.source)
      : null;
    const searchResults = searchQuery.trim() ? (searchHits ?? []) : [];

    return Array.from(
      new Map(
        [...(selectedItem ? [selectedItem] : []), ...searchResults]
          .filter((item) => Boolean(item.uri))
          .map((item) => [item.uri, item] as const),
      ).values(),
    );
  }, [initialInformationModels, searchHits, searchQuery, values.source]);

  const informationModelSuggestionOptions: SuggestionSelectOption[] = useMemo(
    () =>
      informationModelOptionsList.map((option) => ({
        value: option.uri,
        label: getInformationModelLabel(option),
      })),
    [informationModelOptionsList],
  );

  const informationModelEmptyMessage = searching
    ? `${localization.loading}...`
    : searchQuery.trim()
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const resolvedRelationTypeUri = values.type
    ? (relations.find((r) => r.uri === values.type)?.uri ?? values.type)
    : undefined;

  const relationTypeValue =
    resolvedRelationTypeUri &&
    relations.some((r) => r.uri === resolvedRelationTypeUri)
      ? resolvedRelationTypeUri
      : undefined;

  return (
    <>
      <SingleSuggestionSelect
        emptyMessage={localization.search.noHits}
        error={errors?.type}
        fieldsetLegend={
          localization.informationModelForm.fieldLabel.relationType
        }
        onValueChange={(value) => setFieldValue("type", value ?? "")}
        options={relationTypeOptions}
        placeholder={`${localization.informationModelForm.fieldLabel.choseRelation}...`}
        value={relationTypeValue}
      />

      <Fieldset data-size="sm">
        <Fieldset.Legend>
          {localization.informationModelForm.fieldLabel.informationModel}
        </Fieldset.Legend>
        <SearchSuggestionSelect
          emptyMessage={informationModelEmptyMessage}
          error={errors?.source}
          isFetching={searching}
          onSearch={setSearchQuery}
          onValueChange={(value) => {
            setFieldValue("source", value ?? "");
            if (!value) {
              setSearchQuery("");
            }
          }}
          options={informationModelSuggestionOptions}
          placeholder={`${localization.search.search}...`}
          renderOption={(option) => {
            const informationModel = informationModelOptionsList.find(
              (item) => item.uri === option.value,
            );

            return (
              <div className={styles.comboboxOptionTwoColumns}>
                <div>
                  {informationModel?.title
                    ? getTranslateText(informationModel.title)
                    : option.label}
                </div>
                <div>
                  {getTranslateText(
                    informationModel?.organization?.prefLabel,
                  ) ?? ""}
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
