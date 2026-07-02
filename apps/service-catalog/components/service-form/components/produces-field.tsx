import { LocalizedStrings, Output, Service } from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  DialogActions,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  LanguageSuggestion,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
  useDebounce,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
  useSearchLanguageByUri,
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
  Combobox,
  Fieldset,
  Heading,
  Paragraph,
  Textfield,
  ValidationMessage,
  Dialog,
} from "@digdir/designsystemet-react";
import { FieldArray, Formik, useFormikContext } from "formik";
import styles from "../service-form.module.css";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity } from "lodash";
import { producesSchema } from "../validation-schema";

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

const DatasetFieldset = ({ searchEnv }: { searchEnv: string }) => {
  const { values, setFieldValue } = useFormikContext<Output>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: datasetSuggestions, isLoading: searching } =
    useSearchDatasetSuggestions(searchEnv, debouncedSearchTerm);
  const { data: selectedDatasets, isLoading } = useSearchDatasetsByUri(
    searchEnv,
    values.isPartOf ?? [],
  );

  const comboboxOptions = [
    ...new Map(
      [
        ...(selectedDatasets ?? []),
        ...(datasetSuggestions ?? []),
        ...(values.isPartOf ?? []).map((uri) => {
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
    <Fieldset data-size="sm">
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          helpText={localization.serviceForm.helptext.producesDataset}
        >
          {localization.serviceForm.fieldLabel.producesDataset}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      <Combobox
        data-size="sm"
        portal={false}
        onValueChange={(selectedValues: string[]) =>
          setFieldValue("isPartOf", selectedValues)
        }
        onChange={(input: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(input.target.value)
        }
        loading={searching}
        multiple
        hideClearButton
        value={values.isPartOf ?? []}
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
