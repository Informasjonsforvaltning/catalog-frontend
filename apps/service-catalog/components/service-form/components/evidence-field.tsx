import {
  Evidence,
  LocalizedStrings,
  ReferenceDataCode,
  Service,
} from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  useDebounce,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
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
  Checkbox,
  Combobox,
  Fieldset,
  Heading,
  Paragraph,
  Textfield,
  ValidationMessage,
  Dialog,
  useCheckboxGroup,
} from "@digdir/designsystemet-react";
import {
  Field,
  FieldArray,
  Formik,
  FormikErrors,
  useFormikContext,
} from "formik";
import styles from "../service-form.module.css";
import { useEffect, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity, sortBy } from "lodash";
import {
  confirmedEvidenceSchema,
  draftEvidenceSchema,
} from "../validation-schema";

interface Props {
  errors?:
    | string
    | Array<{ title: LocalizedStrings; description: LocalizedStrings }>;
  languages: ReferenceDataCode[];
  searchEnv: string;
  validationSchema: typeof confirmedEvidenceSchema | typeof draftEvidenceSchema;
}

interface ModalProps {
  languages: ReferenceDataCode[];
  searchEnv: string;
  validationSchema: typeof confirmedEvidenceSchema | typeof draftEvidenceSchema;
  onCancel: () => void;
  onChange: (values: Evidence) => void;
  onSuccess: (values: Evidence) => void;
  template: Evidence;
  type: "new" | "edit";
}

const LANGUAGE_ORDER = [
  "http://publications.europa.eu/resource/authority/language/NOB",
  "http://publications.europa.eu/resource/authority/language/NNO",
  "http://publications.europa.eu/resource/authority/language/ENG",
  "http://publications.europa.eu/resource/authority/language/SMI",
];

const LanguageFieldset = ({
  languages,
}: {
  languages: ReferenceDataCode[];
}) => {
  const { values, setFieldValue } = useFormikContext<Evidence>();
  const langNOR = languages.find((lang) => lang.code === "NOR");

  const { getCheckboxProps } = useCheckboxGroup({
    value: values.language ?? [],
    onChange: (newValues) => setFieldValue("language", newValues),
  });

  const sortedLanguages = sortBy(languages, (item) =>
    LANGUAGE_ORDER.indexOf(item.uri),
  );

  return (
    <Fieldset data-size="sm">
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          tagColor="info"
          tagTitle={localization.tag.recommended}
          helpText={localization.datasetForm.helptext.language}
        >
          {localization.datasetForm.fieldLabel.language}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      {langNOR &&
        values.language &&
        values.language.some((lang) => lang.includes("NOR")) && (
          <Checkbox
            key={langNOR.uri}
            {...getCheckboxProps(langNOR.uri)}
            label={getTranslateText(langNOR.label)}
          />
        )}
      {sortedLanguages
        .filter((lang) => lang.code !== "NOR")
        .map((lang) => (
          <Checkbox
            key={lang.uri}
            {...getCheckboxProps(lang.uri)}
            label={getTranslateText(lang.label)}
          />
        ))}
    </Fieldset>
  );
};

const DatasetFieldset = ({ searchEnv }: { searchEnv: string }) => {
  const { values, setFieldValue } = useFormikContext<Evidence>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: datasetSuggestions, isLoading: searching } =
    useSearchDatasetSuggestions(searchEnv, debouncedSearchTerm);
  const { data: selectedDatasets, isLoading } = useSearchDatasetsByUri(
    searchEnv,
    values.dataset ?? [],
  );

  const comboboxOptions = [
    ...new Map(
      [
        ...(selectedDatasets ?? []),
        ...(datasetSuggestions ?? []),
        ...(values.dataset ?? []).map((uri) => {
          const foundItem =
            selectedDatasets?.find(
              (item: { uri: string }) => item.uri === uri,
            ) ||
            datasetSuggestions?.find(
              (item: { uri: string }) => item.uri === uri,
            );

          return {
            uri,
            title: foundItem?.title ?? null,
            description: foundItem?.description ?? null,
            organization: foundItem?.organization ?? null,
          };
        }),
      ].map((option) => [option.uri, option]),
    ).values(),
  ];

  if (isLoading) {
    return null;
  }

  return (
    <Fieldset>
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          helpText={localization.serviceForm.helptext.dataset}
          tagTitle={localization.tag.recommended}
          tagColor="info"
        >
          {localization.serviceForm.fieldLabel.dataset}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      <Combobox
        data-size="sm"
        portal={false}
        onValueChange={(selectedValues: string[]) =>
          setFieldValue("dataset", selectedValues)
        }
        onChange={(input: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(input.target.value)
        }
        loading={searching}
        multiple
        hideClearButton
        value={values.dataset ?? []}
        placeholder={`${localization.search.search}...`}
        filter={() => true}
      >
        <Combobox.Empty>{`${localization.search.noHits}...`}</Combobox.Empty>
        {comboboxOptions.map((suggestion) => (
          <Combobox.Option
            value={suggestion.uri}
            key={suggestion.uri}
            displayValue={
              suggestion.title
                ? capitalizeFirstLetter(getTranslateText(suggestion.title))
                : suggestion.uri
            }
          >
            <div className={styles.comboboxOption}>
              <div>
                {capitalizeFirstLetter(getTranslateText(suggestion.title)) ??
                  suggestion.uri}
              </div>
              <div>
                {capitalizeFirstLetter(
                  getTranslateText(suggestion.description),
                )}
              </div>
              <div>{getTranslateText(suggestion.organization?.prefLabel)}</div>
            </div>
          </Combobox.Option>
        ))}
      </Combobox>
    </Fieldset>
  );
};

const hasNoFieldValues = (values: Evidence) => {
  if (!values) return true;
  return (
    isEmpty(trim(values.identifier)) && isEmpty(pickBy(values.title, identity))
  );
};

export const EvidenceField = (props: Props) => {
  const { errors, languages, searchEnv, validationSchema } = props;
  const { values, setFieldValue } = useFormikContext<Service>();
  const [snapshot, setSnapshot] = useState<Evidence[]>(values.evidence ?? []);
  const evidenceDatasetUris = [
    ...new Set((values.evidence ?? []).flatMap((item) => item.dataset ?? [])),
  ];
  const { data: evidenceDatasets } = useSearchDatasetsByUri(
    searchEnv,
    evidenceDatasetUris,
  );

  return (
    <FieldArray
      name="evidence"
      render={(arrayHelpers) => (
        <div className={cn(styles.fieldSet, errors && styles.errorBorder)}>
          {values.evidence?.map((item, index) => (
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
                    languages={languages}
                    searchEnv={searchEnv}
                    validationSchema={validationSchema}
                    template={item}
                    type="edit"
                    onSuccess={(updatedItem: Evidence) => {
                      arrayHelpers.replace(index, updatedItem);
                      setSnapshot([...(values.evidence ?? [])]);
                    }}
                    onCancel={() => setFieldValue("evidence", snapshot)}
                    onChange={(updatedItem: Evidence) =>
                      arrayHelpers.replace(index, updatedItem)
                    }
                  />
                  <DeleteButton
                    onClick={() => {
                      const newArray = [...(values.evidence ?? [])];
                      newArray.splice(index, 1);
                      setFieldValue("evidence", newArray);
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
                    {localization.datasetForm.fieldLabel.language}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.language
                      ?.map((lang) => {
                        const matchedLang = languages.find(
                          (languageItem) => languageItem.uri === lang,
                        );
                        return matchedLang
                          ? getTranslateText(matchedLang.label)
                          : null;
                      })
                      .filter(Boolean)
                      .join(", ")}
                  </Paragraph>
                </div>
              )}
              {!isEmpty(item.dataset) && (
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.dataset}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.dataset
                      ?.map((uri) => {
                        const matchedDataset = evidenceDatasets?.find(
                          (dataset) => dataset.uri === uri,
                        );
                        return matchedDataset?.title
                          ? capitalizeFirstLetter(
                              getTranslateText(matchedDataset.title),
                            )
                          : uri;
                      })
                      .join(", ")}
                  </Paragraph>
                </div>
              )}
              {!isEmpty(item.relatedDocumentation) && (
                <div>
                  <Heading data-size="2xs" level={3}>
                    {localization.serviceForm.fieldLabel.relatedDocumentation}
                  </Heading>
                  <Paragraph data-size="sm">
                    {item.relatedDocumentation?.join(", ")}
                  </Paragraph>
                </div>
              )}
            </Card>
          ))}

          <FieldModal
            languages={languages}
            searchEnv={searchEnv}
            validationSchema={validationSchema}
            template={{
              title: {},
              description: {},
              language: [],
              identifier: "",
              relatedDocumentation: [],
              dataset: [],
            }}
            type="new"
            onSuccess={() => setSnapshot([...(values.evidence ?? [])])}
            onCancel={() => setFieldValue("evidence", snapshot)}
            onChange={(updatedItem: Evidence) => {
              if (snapshot.length === (values.evidence?.length ?? 0)) {
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
    languages,
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
            {localization.serviceForm.fieldLabel.evidence.toLowerCase()}
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
          {({ isSubmitting, submitForm, values, dirty, resetForm, errors }) => {
            useEffect(() => {
              if (dirty) {
                onChange({ ...values });
              }
            }, [values, dirty]);

            const relatedDocumentationErrors = (
              errors as FormikErrors<Evidence>
            ).relatedDocumentation;

            return (
              <>
                <Heading>
                  {type === "edit" ? localization.edit : localization.add}{" "}
                  {localization.serviceForm.fieldLabel.evidence.toLowerCase()}
                </Heading>
                <div className={styles.modalContent}>
                  <FormikLanguageFieldset
                    as={Textfield}
                    name="title"
                    legend={localization.serviceForm.fieldLabel.title}
                  />

                  <FieldsetDivider />
                  <FormikLanguageFieldset
                    as={Textfield}
                    name="description"
                    legend={localization.serviceForm.fieldLabel.description}
                  />

                  <FieldsetDivider />
                  <LanguageFieldset languages={languages} />

                  <FieldsetDivider />
                  <DatasetFieldset searchEnv={searchEnv} />

                  <FieldsetDivider />
                  <FieldArray name="relatedDocumentation">
                    {(arrayHelpers) => (
                      <Fieldset data-size="sm">
                        <Fieldset.Legend>
                          <TitleWithHelpTextAndTag
                            helpText={
                              localization.serviceForm.helptext
                                .relatedDocumentation
                            }
                          >
                            {
                              localization.serviceForm.fieldLabel
                                .relatedDocumentation
                            }
                          </TitleWithHelpTextAndTag>
                        </Fieldset.Legend>
                        {(values.relatedDocumentation ?? []).map((_, index) => {
                          const fieldError = Array.isArray(
                            relatedDocumentationErrors,
                          )
                            ? relatedDocumentationErrors[index]
                            : undefined;
                          return (
                            <div
                              key={`relatedDocumentation-${index}`}
                              className={cn(styles.flex, styles.gap2)}
                            >
                              <Field
                                as={Textfield}
                                data-size="sm"
                                name={`relatedDocumentation[${index}]`}
                                aria-label={`${localization.serviceForm.fieldLabel.relatedDocumentation} ${index + 1}`}
                                error={
                                  typeof fieldError === "string"
                                    ? fieldError
                                    : undefined
                                }
                              />
                              <DeleteButton
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            </div>
                          );
                        })}
                        <AddButton
                          type="button"
                          onClick={() => arrayHelpers.push("")}
                        >
                          {localization.add}{" "}
                          {localization.serviceForm.fieldLabel.relatedDocumentation.toLowerCase()}
                        </AddButton>
                      </Fieldset>
                    )}
                  </FieldArray>
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
