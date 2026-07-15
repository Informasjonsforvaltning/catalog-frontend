"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Distribution,
  ReferenceDataCode,
  Search,
} from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormikReferenceDataCombobox,
  getSuggestionSelectedItem,
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  FastFieldWithRef,
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchMediaTypeByUri,
  useSearchMediaTypes,
  useSearchDataServiceSuggestions,
  DialogActions,
  useDebounce,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
import {
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Card,
  Dialog,
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Heading,
  Input,
  Skeleton,
  Textfield,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { FastField, FieldArray, Formik, getIn } from "formik";
import styles from "./distributions.module.scss";
import { distributionTemplate } from "../../utils/dataset-initial-values";
import {
  distributionSectionSchema,
  mobilityDistributionSectionSchema,
} from "../../utils/validation-schema";
import { ToggleFieldButton } from "@dataset-catalog/components/dataset-form/components/toggle-field-button";
import { get, isArray, isEmpty, isNil, isObject } from "lodash";
import FieldsetWithDelete from "@dataset-catalog/components/fieldset-with-delete";

const PRIORITY_LICENCE_CODES = ["CC0", "CC_BY_4_0"];

type DistributionSingleSuggestionProps = {
  error?: string;
  isMounted: boolean;
  onValueChange: (value: string | undefined) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  value?: string;
};

const DistributionSingleSuggestion = ({
  error,
  isMounted,
  onValueChange,
  options,
  placeholder,
  value,
}: DistributionSingleSuggestionProps) => {
  const selectedItem = getSuggestionSelectedItem(value, options);

  return isMounted ? (
    <>
      <Suggestion
        data-size="sm"
        selected={selectedItem}
        onSelectedChange={(selected) => onValueChange(selected?.value)}
      >
        <Suggestion.Input
          aria-invalid={error ? true : undefined}
          placeholder={placeholder}
        />
        <Suggestion.Clear />
        <Suggestion.List>
          <Suggestion.Empty>{localization.search.noHits}</Suggestion.Empty>
          {options.map((option) => (
            <Suggestion.Option
              key={option.value}
              value={option.value}
              label={option.label}
            >
              {option.label}
            </Suggestion.Option>
          ))}
        </Suggestion.List>
      </Suggestion>
      {error ? <ValidationMessage>{error}</ValidationMessage> : null}
    </>
  ) : (
    <Input
      data-size="sm"
      aria-invalid={error ? true : undefined}
      disabled
      placeholder={placeholder}
      readOnly
    />
  );
};

const sortLicences = (licences: ReferenceDataCode[]): ReferenceDataCode[] =>
  [...licences].sort((a, b) => {
    const a_priority = PRIORITY_LICENCE_CODES.indexOf(a.code ?? "");
    const b_priority = PRIORITY_LICENCE_CODES.indexOf(b.code ?? "");
    if (a_priority !== -1 || b_priority !== -1) {
      return (
        (a_priority === -1 ? Infinity : a_priority) -
        (b_priority === -1 ? Infinity : b_priority)
      );
    }
    return getTranslateText(a.label)
      .toString()
      .localeCompare(getTranslateText(b.label).toString());
  });

const nonEmptyValues = (values: string[] | null | undefined): string[] =>
  (values ?? []).filter((value) => !isEmpty(value));

type Props = {
  trigger: ReactNode;
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses?: ReferenceDataCode[];
  onSuccess: (values: Distribution) => void;
  onCancel?: () => void;
  onChange?: (values: Distribution) => void;
  initialValues: Partial<Distribution> | undefined;
  initialAccessServices: Search.SearchObject[];
  type: "new" | "edit";
  distributionType: "distribution" | "sample";
  isMobility?: boolean;
  mobilityDataStandards?: ReferenceDataCode[];
  mobilityRights?: ReferenceDataCode[];
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
  initialAccessServices,
  type,
  distributionType,
  isMobility,
  mobilityDataStandards,
  mobilityRights,
}: Props) => {
  const [selectedFileTypeUris, setSelectedFileTypeUris] = useState(
    initialValues?.format ?? [],
  );
  const [selectedMediaTypeUris, setSelectedMediaTypeUris] = useState(
    nonEmptyValues(initialValues?.mediaType),
  );
  const [selectedAccessServiceUris, setSelectedAccessServiceUris] = useState(
    initialValues?.accessServices ?? [],
  );
  const template = distributionTemplate(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const resetFormRef = useRef<(() => void) | null>(null);

  const isMounted = useSuggestionMounted();
  const [searchQueryMediaTypes, setSearchQueryMediaTypes] =
    useState<string>("");
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>("");
  const [searchDataServicesQuery, setSearchDataServicesQuery] =
    useState<string>("");
  const debouncedSearchDataServicesQuery = useDebounce(searchDataServicesQuery);

  const [focus, setFocus] = useState<string | null>();

  const resetLocalState = () => {
    setSelectedFileTypeUris(initialValues?.format ?? []);
    setSelectedMediaTypeUris(nonEmptyValues(initialValues?.mediaType));
    setSelectedAccessServiceUris(initialValues?.accessServices ?? []);
    setSearchQueryMediaTypes("");
    setSearchQueryFileTypes("");
    setSearchDataServicesQuery("");
    setSubmitted(false);
    setFocus(null);
  };

  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const setInputRef = (
    fieldName: string,
    element: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    inputRefs.current[fieldName] = element;
  };

  const { data: mediaTypes, isLoading: searchingMediaTypes } =
    useSearchMediaTypes(searchQueryMediaTypes, referenceDataEnv);
  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(
    searchQueryFileTypes,
    referenceDataEnv,
  );
  const { data: selectedMediaTypes, isLoading: loadingSelectedMediaTypes } =
    useSearchMediaTypeByUri(selectedMediaTypeUris, referenceDataEnv);
  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } =
    useSearchFileTypeByUri(selectedFileTypeUris, referenceDataEnv);
  const { data: dataServices, isFetching: searchingDataServices } =
    useSearchDataServiceSuggestions(
      searchEnv,
      debouncedSearchDataServicesQuery,
    );

  const accessServiceList = useMemo(() => {
    const resolveAccessService = (uri: string) =>
      initialAccessServices.find((service) => service.uri === uri) ||
      dataServices?.find(
        (service: Search.Suggestion) => service.uri === uri,
      ) || {
        id: uri,
        uri,
        searchType: "DATA_SERVICE" as const,
      };

    const selectedItems = selectedAccessServiceUris.map(resolveAccessService);
    const searchHits = searchDataServicesQuery.trim()
      ? (dataServices ?? [])
      : [];

    return Array.from(
      new Map(
        [...selectedItems, ...searchHits]
          .filter((item) => Boolean(item.uri))
          .map((item) => [item.uri, item] as const),
      ).values(),
    );
  }, [
    dataServices,
    initialAccessServices,
    searchDataServicesQuery,
    selectedAccessServiceUris,
  ]);

  const handleSubmit = (
    values: Distribution,
    { setSubmitting, resetForm }: any,
  ) => {
    const trimmedValues: Distribution = trimObjectWhitespace(values);
    if (trimmedValues.mediaType) {
      trimmedValues.mediaType = nonEmptyValues(trimmedValues.mediaType);
      if (isEmpty(trimmedValues.mediaType)) {
        trimmedValues.mediaType = undefined;
      }
    }
    if (trimmedValues.accessServices) {
      trimmedValues.accessServices = trimmedValues.accessServices.filter(
        (value: string) => !isEmpty(value),
      );
    }
    onSuccess(trimmedValues);
    setSubmitting(false);
    resetForm();
    resetLocalState();
    modalRef.current?.close();
  };

  const FIELD_CONFIG = [
    {
      name: "downloadURL",
      getValue: (values: Distribution) => values?.downloadURL,
      render: (props: any) => (
        <FieldArray name="downloadURL">
          {(arrayHelpers) => (
            <>
              {(arrayHelpers.form.values.downloadURL || []).map(
                (_: any, index: number, array: string[]) => (
                  <React.Fragment key={`downloadURL-${index}`}>
                    <div className={styles["padding-bottom-4"]}>
                      <FieldsetWithDelete
                        onDelete={() => arrayHelpers.remove(index)}
                      >
                        <FastFieldWithRef
                          name={`downloadURL[${index}]`}
                          ref={(
                            el: HTMLInputElement | HTMLTextAreaElement | null,
                          ) => props.setInputRef(`downloadURL[${index}]`, el)}
                          label={
                            index === 0 ? (
                              <TitleWithHelpTextAndTag
                                helpText={
                                  localization.datasetForm.helptext.downloadURL
                                }
                              >
                                {
                                  localization.datasetForm.fieldLabel
                                    .downloadURL
                                }
                              </TitleWithHelpTextAndTag>
                            ) : (
                              ""
                            )
                          }
                          as={Textfield}
                          data-size="sm"
                          error={props.errors?.downloadURL?.[index]}
                        />
                      </FieldsetWithDelete>
                    </div>
                  </React.Fragment>
                ),
              )}
              <AddButton
                onClick={() => {
                  arrayHelpers.push("");
                  props.setFocus(
                    arrayHelpers.form.values.downloadURL
                      ? `downloadURL[${arrayHelpers.form.values.downloadURL.length}]`
                      : "downloadURL[0]",
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
      name: "accessServices",
      addValue: [""],
      shouldShow: ({ distributionType }: any) =>
        distributionType === "distribution",
      render: ({
        setFieldValue,
        setSelectedAccessServiceUris,
        setSearchDataServicesQuery,
        accessServiceList,
        searchingDataServices,
        selectedAccessServiceUris,
        isMounted,
      }: any) => {
        const accessServiceOptions: SuggestionSelectOption[] =
          accessServiceList.map((option: Search.Suggestion) => ({
            value: option.uri,
            label: getTranslateText(option.title) || option.uri,
          }));

        const selectedAccessServices = (selectedAccessServiceUris ?? []).map(
          (uri: string) => ({
            value: uri,
            label:
              accessServiceOptions.find((option) => option.value === uri)
                ?.label ?? uri,
          }),
        );

        const emptyMessage = searchingDataServices
          ? `${localization.loading}...`
          : searchDataServicesQuery.trim()
            ? localization.search.noHits
            : `${localization.search.typeToSearch}...`;

        return (
          <Fieldset data-size="sm">
            <Fieldset.Legend>
              <TitleWithHelpTextAndTag
                helpText={localization.datasetForm.helptext.accessServices}
              >
                {localization.datasetForm.fieldLabel.accessServices}
              </TitleWithHelpTextAndTag>
            </Fieldset.Legend>
            {selectedAccessServiceUris?.every((v: string) =>
              accessServiceList.find(
                (option: Search.Suggestion) => option.uri === v,
              ),
            ) ? (
              <FieldsetWithDelete
                onDelete={() => setFieldValue("accessServices", null)}
              >
                <SearchSuggestionSelect
                  emptyMessage={emptyMessage}
                  inputRef={(el: HTMLInputElement | null) =>
                    setInputRef("accessServices", el)
                  }
                  isFetching={searchingDataServices}
                  isMounted={isMounted}
                  multiple
                  onSearch={setSearchDataServicesQuery}
                  onSelectedChange={(selectedItems) => {
                    const selectedValues = selectedItems.map(
                      (item) => item.value,
                    );
                    setFieldValue("accessServices", selectedValues);
                    setSelectedAccessServiceUris(selectedValues);
                  }}
                  options={accessServiceOptions}
                  placeholder={`${localization.search.search}...`}
                  renderOption={(option) => {
                    const service = accessServiceList.find(
                      (item: Search.Suggestion) => item.uri === option.value,
                    );

                    return (
                      <div className={styles.comboboxOptionTwoColumns}>
                        <div>
                          {service?.title
                            ? getTranslateText(service.title)
                            : getTranslateText(service?.description)}
                        </div>
                        <div>
                          {getTranslateText(service?.organization?.prefLabel) ??
                            ""}
                        </div>
                      </div>
                    );
                  }}
                  selected={selectedAccessServices}
                />
              </FieldsetWithDelete>
            ) : (
              <Skeleton variant="rectangle" height="100px" width="100%" />
            )}
          </Fieldset>
        );
      },
    },
    {
      name: "mediaType",
      addValue: [],
      render: ({
        setFieldValue,
        setSelectedMediaTypeUris,
        setSearchQueryMediaTypes,
        values,
        selectedMediaTypes,
        mediaTypes,
        loadingSelectedMediaTypes,
        searchingMediaTypes,
      }: any) => {
        const mediaTypeValues = nonEmptyValues(values?.mediaType);

        return (
          <Fieldset data-size="sm">
            <Fieldset.Legend>
              <TitleWithHelpTextAndTag
                helpText={localization.datasetForm.helptext.mediaType}
              >
                {localization.datasetForm.fieldLabel.mediaType}
              </TitleWithHelpTextAndTag>
            </Fieldset.Legend>
            <FieldsetWithDelete
              onDelete={() => {
                setFieldValue("mediaType", null);
                setSelectedMediaTypeUris([]);
              }}
            >
              <FormikReferenceDataCombobox
                onChange={(event) =>
                  setSearchQueryMediaTypes(event.target.value)
                }
                onValueChange={(selectedValues) => {
                  const selectedMediaTypes = nonEmptyValues(selectedValues);
                  setFieldValue("mediaType", selectedMediaTypes);
                  setSelectedMediaTypeUris(selectedMediaTypes);
                }}
                value={mediaTypeValues}
                selectedValuesSearchHits={selectedMediaTypes ?? []}
                querySearchHits={mediaTypes ?? []}
                formikValues={mediaTypeValues}
                loading={loadingSelectedMediaTypes || searchingMediaTypes}
                portal={false}
                showCodeAsDescription={true}
                hideClearButton={false}
                ref={(el: HTMLInputElement | null) =>
                  setInputRef("mediaType", el)
                }
                size="md"
              />
            </FieldsetWithDelete>
          </Fieldset>
        );
      },
    },
    {
      name: "page",
      getValue: (values: Distribution) => values?.page,
      render: (props: any) => (
        <FieldArray name="page">
          {(arrayHelpers) => (
            <>
              {(arrayHelpers.form.values.page || []).map(
                (_: any, index: number) => (
                  <React.Fragment key={`page-${index}`}>
                    <div className={styles["padding-bottom-4"]}>
                      <FieldsetWithDelete
                        onDelete={() => arrayHelpers.remove(index)}
                      >
                        <FastFieldWithRef
                          name={`page[${index}]`}
                          ref={(
                            el: HTMLInputElement | HTMLTextAreaElement | null,
                          ) => props.setInputRef(`page[${index}]`, el)}
                          label={
                            index === 0 ? (
                              <TitleWithHelpTextAndTag
                                helpText={
                                  localization.datasetForm.helptext.page
                                }
                              >
                                {localization.datasetForm.fieldLabel.page}
                              </TitleWithHelpTextAndTag>
                            ) : (
                              ""
                            )
                          }
                          as={Textfield}
                          data-size="sm"
                          error={props.errors?.page?.[index]}
                        />
                      </FieldsetWithDelete>
                    </div>
                  </React.Fragment>
                ),
              )}
              <AddButton
                onClick={() => {
                  arrayHelpers.push("");
                  props.setFocus(
                    arrayHelpers.form.values.page
                      ? `page[${arrayHelpers.form.values.page.length}]`
                      : "page[0]",
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
      name: "conformsTo",
      addValue: [{ prefLabel: { nb: "", nn: "" }, uri: "" }],
      shouldShow: ({ distributionType }: any) =>
        distributionType === "distribution",
      render: ({ errors }: any) => (
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={
                localization.datasetForm.helptext.distributionConformsTo
              }
            >
              {localization.datasetForm.fieldLabel.conformsTo}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <FieldArray name="conformsTo">
            {({ push, remove, form }) => (
              <>
                {form.values.conformsTo?.map((_: any, i: number) => (
                  <div className={styles.add} key={`conformsTo-${i}`}>
                    <Card>
                      <div>
                        <FormikLanguageFieldset
                          legend={
                            <TitleWithHelpTextAndTag
                              tagTitle={localization.tag.required}
                              tagColor="warning"
                            >
                              {localization.title}
                            </TitleWithHelpTextAndTag>
                          }
                          as={Textfield}
                          name={`conformsTo[${i}].prefLabel`}
                          ref={(
                            el: HTMLInputElement | HTMLTextAreaElement | null,
                          ) => setInputRef("conformsTo", el)}
                        />
                      </div>
                      <FastField
                        data-size="sm"
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
                    push({ prefLabel: { nb: "", nn: "" }, uri: "" });
                    setFocus("conformsTo");
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
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog
        ref={modalRef}
        className={styles.dialog}
        onClose={() => {
          resetFormRef.current?.();
          resetLocalState();
        }}
      >
        <Formik
          initialValues={{ ...template }}
          enableReinitialize
          name="distribution"
          validateOnChange={submitted}
          validateOnBlur={submitted}
          validationSchema={
            isMobility
              ? mobilityDistributionSectionSchema
              : distributionSectionSchema
          }
          onSubmit={handleSubmit}
        >
          {({
            errors,
            isSubmitting,
            submitForm,
            values,
            dirty,
            setFieldValue,
            resetForm,
          }) => {
            resetFormRef.current = resetForm;

            // Call onChange whenever values change for autosave
            useEffect(() => {
              if (dirty && onChange && modalRef.current?.open) {
                onChange(values);
              }
            }, [values, dirty, onChange]);

            const isExpanded = (fieldConfig: any) => {
              const fieldValues = get(values, fieldConfig.name);
              if (fieldConfig.name === "mediaType") {
                return isArray(fieldValues);
              }
              if (isArray(fieldValues)) return fieldValues.length > 0;
              if (isObject(fieldValues)) return !isEmpty(fieldValues);
              return !isNil(fieldValues);
            };

            // Helper to render a field
            const renderField = (
              fieldConfig: any,
              showDivider: boolean = false,
            ) => {
              const props = {
                accessServiceList,
                searchingDataServices,
                selectedAccessServiceUris,
                distributionType,
                expanded: isExpanded(fieldConfig),
                fileTypes,
                mediaTypes,
                selectedFileTypes,
                selectedMediaTypes,
                openLicenses,
                mobilityDataStandards,
                mobilityRights,
                isMounted,
                ref: (el: HTMLInputElement | HTMLTextAreaElement | null) =>
                  setInputRef(fieldConfig.name, el),
                loadingSelectedFileTypes,
                loadingSelectedMediaTypes,
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
                    <Heading data-size="xs">
                      {type === "new"
                        ? distributionType === "distribution"
                          ? localization.datasetForm.button.addDistribution
                          : localization.datasetForm.button.addSample
                        : `${localization.edit} ${distributionType === "distribution" ? localization.datasetForm.fieldLabel.distribution.toLowerCase() : localization.datasetForm.fieldLabel.sample.toLowerCase()}`}
                    </Heading>

                    <div className={styles.modalContent}>
                      <FormikLanguageFieldset
                        as={Textfield}
                        name="title"
                        legend={
                          <TitleWithHelpTextAndTag
                            helpText={localization.datasetForm.helptext.title}
                            tagTitle={localization.tag.recommended}
                            tagColor="info"
                          >
                            {localization.title}
                          </TitleWithHelpTextAndTag>
                        }
                      />
                      <FieldsetDivider />
                      <FormikLanguageFieldset
                        as={TextareaWithPrefix}
                        legend={
                          <TitleWithHelpTextAndTag
                            helpText={
                              localization.datasetForm.helptext
                                .distributionDescription
                            }
                            tagColor="info"
                            tagTitle={localization.tag.recommended}
                          >
                            {localization.description}
                          </TitleWithHelpTextAndTag>
                        }
                        name="description"
                      />
                      <FieldsetDivider />
                      <FieldArray name="accessURL">
                        {(arrayHelpers) => (
                          <>
                            {(arrayHelpers.form.values.accessURL || []).map(
                              (_: any, index: number, array: string[]) => {
                                return (
                                  <React.Fragment key={`accessURL-${index}`}>
                                    <div>
                                      {index > 0 ? (
                                        <FieldsetWithDelete
                                          onDelete={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          style={{ marginTop: "1rem" }}
                                        >
                                          <FastFieldWithRef
                                            name={`accessURL[${index}]`}
                                            ref={(
                                              el:
                                                | HTMLInputElement
                                                | HTMLTextAreaElement
                                                | null,
                                            ) =>
                                              setInputRef(
                                                `accessURL[${index}]`,
                                                el,
                                              )
                                            }
                                            label={
                                              index === 0 ? (
                                                <TitleWithHelpTextAndTag
                                                  tagColor="warning"
                                                  tagTitle={
                                                    localization.tag.required
                                                  }
                                                  helpText={
                                                    localization.datasetForm
                                                      .helptext.accessURL
                                                  }
                                                >
                                                  {
                                                    localization.datasetForm
                                                      .fieldLabel.accessURL
                                                  }
                                                </TitleWithHelpTextAndTag>
                                              ) : (
                                                ""
                                              )
                                            }
                                            as={Textfield}
                                            data-size="sm"
                                            error={errors?.accessURL?.[index]}
                                          />
                                        </FieldsetWithDelete>
                                      ) : (
                                        <FastFieldWithRef
                                          name={`accessURL[${index}]`}
                                          ref={(
                                            el:
                                              | HTMLInputElement
                                              | HTMLTextAreaElement
                                              | null,
                                          ) =>
                                            setInputRef(
                                              `accessURL[${index}]`,
                                              el,
                                            )
                                          }
                                          label={
                                            index === 0 ? (
                                              <TitleWithHelpTextAndTag
                                                tagColor="warning"
                                                tagTitle={
                                                  localization.tag.required
                                                }
                                                helpText={
                                                  localization.datasetForm
                                                    .helptext.accessURL
                                                }
                                              >
                                                {
                                                  localization.datasetForm
                                                    .fieldLabel.accessURL
                                                }
                                              </TitleWithHelpTextAndTag>
                                            ) : (
                                              ""
                                            )
                                          }
                                          as={Textfield}
                                          data-size="sm"
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
                                arrayHelpers.push("");
                                setFocus(
                                  arrayHelpers.form.values.accessURL
                                    ? `accessURL[${arrayHelpers.form.values.accessURL.length}]`
                                    : "accessURL[0]",
                                );
                              }}
                            >
                              {`${localization.datasetForm.fieldLabel.accessURL}`}
                            </AddButton>
                            <FieldsetDivider />
                          </>
                        )}
                      </FieldArray>
                      {isMobility && "mobilityDataStandard" in values ? (
                        <>
                          <Fieldset data-size="sm">
                            <Fieldset.Legend>
                              <TitleWithHelpTextAndTag
                                tagTitle={localization.tag.required}
                                helpText={
                                  localization.datasetForm.helptext
                                    .mobilityDataStandard
                                }
                              >
                                {
                                  localization.datasetForm.fieldLabel
                                    .mobilityDataStandard
                                }
                              </TitleWithHelpTextAndTag>
                            </Fieldset.Legend>
                            <DistributionSingleSuggestion
                              error={errors.mobilityDataStandard}
                              isMounted={isMounted}
                              onValueChange={(value) =>
                                setFieldValue(
                                  "mobilityDataStandard",
                                  value ?? "",
                                )
                              }
                              options={[
                                ...(mobilityDataStandards?.map(
                                  (mobilityDataStandard) => ({
                                    value: mobilityDataStandard.uri,
                                    label: getTranslateText(
                                      mobilityDataStandard.label,
                                    ),
                                  }),
                                ) ?? []),
                              ]}
                              value={values.mobilityDataStandard ?? ""}
                            />
                          </Fieldset>
                          <FieldsetDivider />
                        </>
                      ) : undefined}
                      {isMobility && values.rights ? (
                        <>
                          <Fieldset data-size="sm">
                            <Fieldset.Legend>
                              <TitleWithHelpTextAndTag
                                helpText={
                                  localization.datasetForm.helptext
                                    .distributionRights
                                }
                                tagTitle={localization.tag.required}
                              >
                                {
                                  localization.datasetForm.fieldLabel
                                    .distributionRights
                                }
                              </TitleWithHelpTextAndTag>
                            </Fieldset.Legend>
                            <DistributionSingleSuggestion
                              error={getIn(errors, "rights.type")}
                              isMounted={isMounted}
                              onValueChange={(value) =>
                                setFieldValue("rights.type", value ?? "")
                              }
                              options={[
                                ...(mobilityRights?.map((mobilityRight) => ({
                                  value: mobilityRight.uri,
                                  label: getTranslateText(mobilityRight.label),
                                })) ?? []),
                              ]}
                              value={values.rights?.type ?? ""}
                            />
                          </Fieldset>
                          <FieldsetDivider />
                        </>
                      ) : undefined}
                      <Fieldset data-size="sm">
                        <Fieldset.Legend>
                          <TitleWithHelpTextAndTag
                            helpText={
                              localization.datasetForm.helptext.fileType
                            }
                            tagTitle={
                              isMobility
                                ? localization.tag.required
                                : localization.tag.recommended
                            }
                            tagColor={isMobility ? undefined : "info"}
                          >
                            {localization.datasetForm.fieldLabel.format}
                          </TitleWithHelpTextAndTag>
                        </Fieldset.Legend>
                        <FormikReferenceDataCombobox
                          onChange={(event) =>
                            setSearchQueryFileTypes(event.target.value)
                          }
                          onValueChange={(selectedValues) => {
                            setFieldValue("format", selectedValues);
                            setSelectedFileTypeUris(selectedValues);
                          }}
                          value={values?.format || []}
                          selectedValuesSearchHits={selectedFileTypes ?? []}
                          querySearchHits={fileTypes ?? []}
                          formikValues={values?.format ?? []}
                          loading={
                            loadingSelectedFileTypes || searchingFileTypes
                          }
                          portal={false}
                          hideClearButton={false}
                          ref={(el: HTMLInputElement | null) =>
                            setInputRef("format", el)
                          }
                          error={errors.format}
                          size="md"
                        />
                      </Fieldset>
                      <FieldsetDivider />
                      <Fieldset data-size="sm">
                        <Fieldset.Legend>
                          <TitleWithHelpTextAndTag
                            tagTitle={localization.tag.recommended}
                            tagColor="info"
                            helpText={localization.datasetForm.helptext.license}
                          >
                            {localization.datasetForm.fieldLabel.license}
                          </TitleWithHelpTextAndTag>
                        </Fieldset.Legend>
                        <DistributionSingleSuggestion
                          isMounted={isMounted}
                          onValueChange={(value) =>
                            setFieldValue("license", value ?? "")
                          }
                          options={[
                            ...(values?.license &&
                            !openLicenses?.some((l) => l.uri === values.license)
                              ? [
                                  {
                                    value: values.license,
                                    label: values.license,
                                  },
                                ]
                              : []),
                            ...sortLicences(openLicenses ?? []).map(
                              (license) => ({
                                value: license.uri,
                                label: getTranslateText(license.label),
                              }),
                            ),
                          ]}
                          placeholder={`${localization.search.search}...`}
                          value={values.license}
                        />
                      </Fieldset>
                      <FieldsetDivider />
                      {expandedFields.map((f, index) =>
                        renderField(
                          f,
                          !(
                            minimizedFields.length === 0 &&
                            index === expandedFields.length - 1
                          ),
                        ),
                      )}
                      {minimizedFields.map((f) => renderField(f))}
                    </div>

                    <DialogActions>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => submitForm()}
                        data-size="sm"
                      >
                        {type === "new"
                          ? localization.add
                          : localization.datasetForm.button.updateDistribution}
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          resetForm();
                          resetLocalState();
                          onCancel?.();
                          modalRef.current?.close();
                        }}
                        disabled={isSubmitting}
                        data-size="sm"
                      >
                        {localization.button.cancel}
                      </Button>
                    </DialogActions>
                  </>
                )}
              </>
            );
          }}
        </Formik>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
