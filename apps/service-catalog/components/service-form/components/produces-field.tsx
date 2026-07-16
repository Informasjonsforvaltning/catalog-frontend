"use client";

import { LocalizedStrings, Output, Service } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  LanguageSuggestion,
  MultiSuggestionSelect,
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
  useDebounce,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
  useSearchLanguageByUri,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
import cn from "classnames";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Card,
  Fieldset,
  Heading,
  Paragraph,
  Textfield,
  ValidationMessage,
  Dialog,
} from "@digdir/designsystemet-react";
import { FieldArray, Formik, useFormikContext } from "formik";
import styles from "../service-form.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity } from "lodash";
import { producesSchema } from "../validation-schema";
import {
  SERVICE_OUTPUT_TYPES,
  serviceOutputTypeLabel,
} from "../service-output-types";

interface Props {
  errors?:
    | string
    | Array<{ title: LocalizedStrings; description: LocalizedStrings }>;
  referenceDataEnv: string;
  searchEnv: string;
  validationSchema: typeof producesSchema;
}

interface ModalProps {
  referenceDataEnv: string;
  searchEnv: string;
  validationSchema: typeof producesSchema;
  onCancel: () => void;
  onChange: (values: Output) => void;
  onSuccess: (values: Output) => void;
  template: Output;
  type: "new" | "edit";
}

const LanguageFieldset = ({
  referenceDataEnv,
}: {
  referenceDataEnv: string;
}) => (
  <Fieldset data-size="sm">
    <Fieldset.Legend>
      <TitleWithHelpTextAndTag
        tagColor="info"
        tagTitle={localization.tag.recommended}
        helpText={localization.serviceForm.helptext.language}
      >
        {localization.serviceForm.fieldLabel.language}
      </TitleWithHelpTextAndTag>
    </Fieldset.Legend>
    <LanguageSuggestion referenceDataEnv={referenceDataEnv} />
  </Fieldset>
);

type DatasetOption = {
  uri: string;
  title?: LocalizedStrings | null;
  description?: LocalizedStrings | null;
  organization?: { prefLabel?: LocalizedStrings } | null;
};

const getDatasetLabel = (dataset: DatasetOption) =>
  dataset.title
    ? capitalizeFirstLetter(getTranslateText(dataset.title))
    : dataset.uri;

const DatasetFieldset = ({ searchEnv }: { searchEnv: string }) => {
  const { values, setFieldValue } = useFormikContext<Output>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const isMounted = useSuggestionMounted();
  const fieldValues = values.isPartOf ?? [];
  const { data: datasetSuggestions, isFetching } = useSearchDatasetSuggestions(
    searchEnv,
    debouncedSearchTerm,
  );
  const { data: selectedDatasets } = useSearchDatasetsByUri(
    searchEnv,
    fieldValues,
  );

  const datasetOptions = useMemo((): DatasetOption[] => {
    const selected = (selectedDatasets ?? []) as DatasetOption[];
    const hits = (datasetSuggestions ?? []) as DatasetOption[];

    return [
      ...new Map(
        [
          ...selected,
          ...hits,
          ...fieldValues.map((uri) => {
            const foundItem =
              selected.find((item) => item.uri === uri) ||
              hits.find((item) => item.uri === uri);

            return {
              uri,
              title: foundItem?.title,
              description: foundItem?.description,
              organization: foundItem?.organization,
            };
          }),
        ].map((option) => [option.uri, option]),
      ).values(),
    ];
  }, [datasetSuggestions, fieldValues, selectedDatasets]);

  const datasetByUri = useMemo(
    () => new Map(datasetOptions.map((item) => [item.uri, item])),
    [datasetOptions],
  );

  const options: SuggestionSelectOption[] = useMemo(
    () =>
      datasetOptions.map((dataset) => ({
        value: dataset.uri,
        label: getDatasetLabel(dataset),
        description: capitalizeFirstLetter(
          getTranslateText(dataset.description),
        ),
      })),
    [datasetOptions],
  );

  const selected: SuggestionSelectOption[] = useMemo(
    () =>
      fieldValues.map((uri) => {
        const option = options.find((item) => item.value === uri);

        return {
          value: uri,
          label: option?.label ?? uri,
          description: option?.description,
        };
      }),
    [fieldValues, options],
  );

  const emptyMessage = isFetching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  return (
    <SearchSuggestionSelect
      emptyMessage={emptyMessage}
      fieldsetLegend={
        <TitleWithHelpTextAndTag
          helpText={localization.serviceForm.helptext.producesDataset}
        >
          {localization.serviceForm.fieldLabel.producesDataset}
        </TitleWithHelpTextAndTag>
      }
      isFetching={isFetching}
      isMounted={isMounted}
      multiple
      onSearch={setSearchTerm}
      onSelectedChange={(selectedItems) =>
        setFieldValue(
          "isPartOf",
          selectedItems.map((item) => item.value),
        )
      }
      options={options}
      placeholder={`${localization.search.search}...`}
      renderOption={(option) => {
        const dataset = datasetByUri.get(option.value);

        return (
          <div className={styles.comboboxOption}>
            <div>{option.label}</div>
            <div>
              {capitalizeFirstLetter(getTranslateText(dataset?.description))}
            </div>
            <div>{getTranslateText(dataset?.organization?.prefLabel)}</div>
          </div>
        );
      }}
      selected={selected}
    />
  );
};

const typeOptions = SERVICE_OUTPUT_TYPES.map((option) => ({
  value: option.uri,
  label: option.label,
}));

const TypeFieldset = () => {
  const { values, setFieldValue } = useFormikContext<Output>();
  const isMounted = useSuggestionMounted();

  return (
    <MultiSuggestionSelect
      emptyMessage={localization.search.noHits}
      fieldsetLegend={
        <TitleWithHelpTextAndTag
          helpText={localization.serviceForm.helptext.producesType}
        >
          {localization.serviceForm.fieldLabel.producesType}
        </TitleWithHelpTextAndTag>
      }
      isMounted={isMounted}
      onSelectedChange={(selectedValues) =>
        setFieldValue("type", selectedValues)
      }
      options={typeOptions}
      placeholder={`${localization.search.search}...`}
      selectedValues={values.type}
    />
  );
};

const hasNoFieldValues = (values: Output) => {
  if (!values) return true;
  return (
    isEmpty(trim(values.identifier)) && isEmpty(pickBy(values.title, identity))
  );
};

export const ProducesField = (props: Props) => {
  const { errors, referenceDataEnv, searchEnv, validationSchema } = props;
  const { values, setFieldValue } = useFormikContext<Service>();
  const [snapshot, setSnapshot] = useState<Output[]>(values.produces ?? []);
  const producesLanguageUris = [
    ...new Set((values.produces ?? []).flatMap((item) => item.language ?? [])),
  ];
  const { data: producesLanguages } = useSearchLanguageByUri(
    producesLanguageUris,
    referenceDataEnv,
  );
  const producesDatasetUris = [
    ...new Set((values.produces ?? []).flatMap((item) => item.isPartOf ?? [])),
  ];
  const { data: producesDatasets } = useSearchDatasetsByUri(
    searchEnv,
    producesDatasetUris,
  );

  return (
    <FieldArray
      name="produces"
      render={(arrayHelpers) => (
        <div className={cn(styles.fieldSet, errors && styles.errorBorder)}>
          {values.produces?.map((item, index) => (
            <Card key={`${index}-${item.identifier}`}>
              <div className={styles.heading}>
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.title}
                  </Heading>
                  <Paragraph data-size="sm">
                    {getTranslateText(item.title)}
                  </Paragraph>
                  {Array.isArray(errors) && errors?.[index]?.title && (
                    <ValidationMessage data-color="danger" data-size="sm">
                      {getTranslateText(errors[index].title)}
                    </ValidationMessage>
                  )}
                </div>

                <div className={styles.buttons}>
                  <FieldModal
                    referenceDataEnv={referenceDataEnv}
                    searchEnv={searchEnv}
                    validationSchema={validationSchema}
                    template={item}
                    type="edit"
                    onSuccess={(updatedItem: Output) => {
                      arrayHelpers.replace(index, updatedItem);
                      setSnapshot([...(values.produces ?? [])]);
                    }}
                    onCancel={() => setFieldValue("produces", snapshot)}
                    onChange={(updatedItem: Output) =>
                      arrayHelpers.replace(index, updatedItem)
                    }
                  />
                  <DeleteButton
                    onClick={() => {
                      const newArray = [...(values.produces ?? [])];
                      newArray.splice(index, 1);
                      setFieldValue("produces", newArray);
                      setSnapshot([...newArray]);
                    }}
                  />
                </div>
              </div>
              <div>
                <Heading data-size="2xs" level={3}>
                  {localization.serviceForm.fieldLabel.description}
                </Heading>
                <Paragraph data-size="sm">
                  {getTranslateText(item.description)}
                </Paragraph>
                {Array.isArray(errors) && errors?.[index]?.description && (
                  <ValidationMessage data-color="danger" data-size="sm">
                    {getTranslateText(errors[index].description)}
                  </ValidationMessage>
                )}
              </div>
              {!isEmpty(item.language) && (
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.language}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.language
                      ?.map((lang) => {
                        const matchedLang = producesLanguages?.find(
                          (languageItem) => languageItem.uri === lang,
                        );
                        return matchedLang
                          ? capitalizeFirstLetter(
                              getTranslateText(matchedLang.label),
                              false,
                            )
                          : null;
                      })
                      .filter(Boolean)
                      .join(", ")}
                  </Paragraph>
                </div>
              )}
              {!isEmpty(item.isPartOf) && (
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.producesDataset}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.isPartOf
                      ?.map((uri) => {
                        const datasetMatch = producesDatasets?.find(
                          (dataset) => dataset.uri === uri,
                        );
                        return getTranslateText(datasetMatch?.title) || uri;
                      })
                      .join(", ")}
                  </Paragraph>
                </div>
              )}
              {!isEmpty(item.type) && (
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.producesType}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.type?.map(serviceOutputTypeLabel).join(", ")}
                  </Paragraph>
                </div>
              )}
            </Card>
          ))}

          <FieldModal
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
            validationSchema={validationSchema}
            template={{
              title: {},
              description: {},
              identifier: "",
              language: [],
              isPartOf: [],
              type: [],
            }}
            type="new"
            onSuccess={() => setSnapshot([...(values.produces ?? [])])}
            onCancel={() => setFieldValue("produces", snapshot)}
            onChange={(updatedItem: Output) => {
              if (snapshot.length === (values.produces?.length ?? 0)) {
                arrayHelpers.push(updatedItem);
              } else {
                arrayHelpers.replace(snapshot.length, updatedItem);
              }
            }}
          />

          {typeof errors === "string" && (
            <ValidationMessage data-color="danger" data-size="sm">
              {errors}
            </ValidationMessage>
          )}
        </div>
      )}
    />
  );
};

const FieldModal = (props: ModalProps) => {
  const {
    referenceDataEnv,
    searchEnv,
    template,
    type,
    onSuccess,
    onCancel,
    onChange,
    validationSchema,
  } = props;
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        {type === "edit" ? (
          <EditButton />
        ) : (
          <AddButton>
            {localization.add}{" "}
            {localization.serviceForm.fieldLabel.produces.toLowerCase()}
          </AddButton>
        )}
      </Dialog.Trigger>
      <Dialog closeButton={false} ref={modalRef}>
        <Formik
          initialValues={template}
          enableReinitialize={true}
          validateOnChange={submitted}
          validateOnBlur={submitted}
          validationSchema={validationSchema}
          onSubmit={(formValues, { setSubmitting, resetForm }) => {
            const trimmedValues = trimObjectWhitespace(formValues);
            onSuccess(trimmedValues);
            setSubmitting(false);
            setSubmitted(true);
            resetForm();
            modalRef.current?.close();
          }}
        >
          {({ isSubmitting, submitForm, values, dirty, resetForm }) => {
            useEffect(() => {
              if (dirty) {
                onChange({ ...values });
              }
            }, [values, dirty]);

            return (
              <>
                <Heading>
                  {type === "edit" ? localization.edit : localization.add}{" "}
                  {localization.serviceForm.fieldLabel.produces.toLowerCase()}
                </Heading>
                <div className={styles.modalContent}>
                  <FormikLanguageFieldset
                    as={Textfield}
                    name="title"
                    legend={localization.serviceForm.fieldLabel.title}
                  />

                  <FieldsetDivider />
                  <FormikLanguageFieldset
                    as={TextareaWithPrefix}
                    name="description"
                    legend={localization.serviceForm.fieldLabel.description}
                  />

                  <FieldsetDivider />
                  <LanguageFieldset referenceDataEnv={referenceDataEnv} />

                  <FieldsetDivider />
                  <DatasetFieldset searchEnv={searchEnv} />

                  <FieldsetDivider />
                  <TypeFieldset />
                </div>
                <DialogActions>
                  <Button
                    type="button"
                    disabled={isSubmitting || hasNoFieldValues(values)}
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
                      resetForm();
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
  );
};
