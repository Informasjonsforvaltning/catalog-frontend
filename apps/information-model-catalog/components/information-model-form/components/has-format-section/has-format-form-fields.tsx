"use client";

import { ModelDocument, ReferenceDataCode } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import { Textfield } from "@digdir/designsystemet-react";
import { Field, FormikErrors } from "formik";
import {
  FieldsetDivider,
  FormikLanguageFieldset,
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  compareLanguages,
  getTranslatedLabel,
  useDebounce,
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchLanguage,
  useSearchLanguageByUri,
} from "@catalog-frontend/ui";
import { useMemo, useState } from "react";

type HasFormatFormFieldsProps = {
  errors: FormikErrors<ModelDocument>;
  setFieldValue: (
    field: string,
    value: ModelDocument[keyof ModelDocument],
  ) => void;
  values: ModelDocument;
  referenceDataEnv: string;
};

export const HasFormatFormFields = ({
  errors,
  setFieldValue,
  values,
  referenceDataEnv,
}: HasFormatFormFieldsProps) => {
  const [languageSearchQuery, setLanguageSearchQuery] = useState("");
  const [formatSearchQuery, setFormatSearchQuery] = useState("");
  const debouncedLanguageSearch = useDebounce(languageSearchQuery);
  const debouncedFormatSearch = useDebounce(formatSearchQuery);

  const { data: languageSearchHits, isFetching: searchingLanguages } =
    useSearchLanguage(debouncedLanguageSearch, referenceDataEnv);
  const { data: selectedLanguages, isLoading: loadingSelectedLanguages } =
    useSearchLanguageByUri(
      values.language ? [values.language] : [],
      referenceDataEnv,
    );

  const { data: formatSearchHits, isFetching: searchingFormats } =
    useSearchFileTypes(debouncedFormatSearch, referenceDataEnv);
  const { data: selectedFormats, isLoading: loadingSelectedFormats } =
    useSearchFileTypeByUri(
      values.format ? [values.format] : [],
      referenceDataEnv,
    );

  const languageOptions = useMemo(() => {
    const sortedSearchHits = [...(languageSearchHits ?? [])].sort(
      compareLanguages,
    );
    return Array.from(
      new Map(
        [
          ...(selectedLanguages ?? []),
          ...sortedSearchHits,
          ...(values.language
            ? [
                {
                  uri: values.language,
                  label: selectedLanguages?.find(
                    (item) => item.uri === values.language,
                  )?.label,
                  code: selectedLanguages?.find(
                    (item) => item.uri === values.language,
                  )?.code,
                },
              ]
            : []),
        ]
          .filter((item): item is ReferenceDataCode & { uri: string } =>
            Boolean(item.uri),
          )
          .map((item) => [item.uri, item] as const),
      ).values(),
    );
  }, [languageSearchHits, selectedLanguages, values.language]);

  const formatOptions = useMemo(() => {
    return Array.from(
      new Map(
        [
          ...(selectedFormats ?? []),
          ...(formatSearchHits ?? []),
          ...(values.format
            ? [
                {
                  uri: values.format,
                  label: selectedFormats?.find(
                    (item) => item.uri === values.format,
                  )?.label,
                },
              ]
            : []),
        ]
          .filter((item): item is ReferenceDataCode & { uri: string } =>
            Boolean(item.uri),
          )
          .map((item) => [item.uri, item] as const),
      ).values(),
    );
  }, [formatSearchHits, selectedFormats, values.format]);

  const languageSuggestionOptions: SuggestionSelectOption[] = useMemo(
    () =>
      languageOptions.map((item) => ({
        value: item.uri,
        label: getTranslatedLabel(item),
      })),
    [languageOptions],
  );

  const formatSuggestionOptions: SuggestionSelectOption[] = useMemo(
    () =>
      formatOptions.map((item) => ({
        value: item.uri,
        label: getTranslatedLabel(item),
      })),
    [formatOptions],
  );

  const languageEmptyMessage = searchingLanguages
    ? `${localization.loading}...`
    : languageSearchQuery.trim()
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const formatEmptyMessage = searchingFormats
    ? `${localization.loading}...`
    : formatSearchQuery.trim()
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const seeAlsoError =
    typeof errors.seeAlso === "string" ? errors.seeAlso : undefined;

  return (
    <>
      <FormikLanguageFieldset
        name="title"
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.informationModelForm.helptext.hasFormatTitle}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.informationModelForm.fieldLabel.hasFormatTitle}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <SearchSuggestionSelect
        emptyMessage={languageEmptyMessage}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={
              localization.informationModelForm.helptext.hasFormatLanguage
            }
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.informationModelForm.fieldLabel.hasFormatLanguage}
          </TitleWithHelpTextAndTag>
        }
        isFetching={searchingLanguages || loadingSelectedLanguages}
        onSearch={setLanguageSearchQuery}
        onValueChange={(value) => {
          setFieldValue("language", value ?? "");
          if (!value) {
            setLanguageSearchQuery("");
          }
        }}
        options={languageSuggestionOptions}
        placeholder={`${localization.search.search}...`}
        value={values.language || undefined}
      />

      <FieldsetDivider />

      <SearchSuggestionSelect
        emptyMessage={formatEmptyMessage}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={
              localization.informationModelForm.helptext.hasFormatFormat
            }
          >
            {localization.informationModelForm.fieldLabel.hasFormatFormat}
          </TitleWithHelpTextAndTag>
        }
        isFetching={searchingFormats || loadingSelectedFormats}
        onSearch={setFormatSearchQuery}
        onValueChange={(value) => {
          setFieldValue("format", value ?? "");
          if (!value) {
            setFormatSearchQuery("");
          }
        }}
        options={formatSuggestionOptions}
        placeholder={`${localization.search.search}...`}
        value={values.format || undefined}
      />

      <FieldsetDivider />

      <Field
        as={Textfield}
        name="seeAlso"
        data-size="sm"
        placeholder="https://"
        label={
          <TitleWithHelpTextAndTag
            helpText={
              localization.informationModelForm.helptext.hasFormatSeeAlso
            }
          >
            {localization.informationModelForm.fieldLabel.hasFormatSeeAlso}
          </TitleWithHelpTextAndTag>
        }
        error={seeAlsoError}
      />
    </>
  );
};
