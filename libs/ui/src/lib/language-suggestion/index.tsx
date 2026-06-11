"use client";

import {
  useDebounce,
  useSearchLanguage,
  useSearchLanguageByUri,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import {
  EXPERIMENTAL_Suggestion as Suggestion,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { useMemo, useState } from "react";
import { useFormikContext } from "formik";

interface Props {
  referenceDataEnv: string;
}

const LANGUAGE_CODE_SORT_ORDER: string[] = [
  "NOR",
  "NOB",
  "NNO",
  "SMI",
  "SME",
  "SMJ",
  "SMA",
  "ENG",
  "SWE",
  "DAN",
  "POL",
  "ARA",
  "SOM",
  "UKR",
  "LIT",
  "FIN",
  "DEU",
  "FRA",
  "SPA",
] as const;

const languageCodeSortIndex = new Map(
  LANGUAGE_CODE_SORT_ORDER.map((code, index) => [code, index]),
);

const getTranslatedLabel = (item: ReferenceDataCode) =>
  item.label
    ? capitalizeFirstLetter(getTranslateText(item.label), false)
    : (item.uri ?? "");

const getOptionLabel = (item: ReferenceDataCode) => {
  const label = getTranslatedLabel(item);

  return item.code ? `${label} (${item.code})` : label;
};

const compareLanguages = (a: ReferenceDataCode, b: ReferenceDataCode) => {
  const indexA = a.code ? languageCodeSortIndex.get(a.code) : undefined;
  const indexB = b.code ? languageCodeSortIndex.get(b.code) : undefined;

  if (indexA !== undefined && indexB !== undefined) {
    return indexA - indexB;
  }
  if (indexA !== undefined) return -1;
  if (indexB !== undefined) return 1;

  return getTranslatedLabel(a).localeCompare(getTranslatedLabel(b), "nb");
};

type LanguageFormValues = {
  language?: string[];
};

export const LanguageSuggestion = ({ referenceDataEnv }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: searchHits, isLoading: isSearching } = useSearchLanguage(
    debouncedSearchTerm,
    referenceDataEnv,
  );
  const { values, errors, setFieldValue } =
    useFormikContext<LanguageFormValues>();
  const { data: selectedValues } = useSearchLanguageByUri(
    values?.language,
    referenceDataEnv,
  );

  const sortedSearchHits = useMemo(
    () => [...(searchHits ?? [])].sort(compareLanguages),
    [searchHits],
  );

  const languageOptions: ReferenceDataCode[] = useMemo(
    () => [
      ...new Map(
        [
          ...(selectedValues ?? []),
          ...sortedSearchHits,
          ...(values.language ?? []).map((uri) => {
            const foundItem =
              selectedValues?.find((item) => item.uri === uri) ||
              sortedSearchHits.find((item) => item.uri === uri);

            return {
              uri,
              label: foundItem?.label,
              code: foundItem?.code,
            };
          }),
        ].map((item) => [item.uri, item]),
      ).values(),
    ],
    [selectedValues, sortedSearchHits, values.language],
  );

  const selectedLanguages = useMemo(
    () =>
      (values.language ?? []).map((uri) => {
        const item = languageOptions.find((option) => option.uri === uri);

        return {
          value: uri,
          label: item ? getTranslatedLabel(item) : uri,
        };
      }),
    [languageOptions, values.language],
  );

  const emptyMessage = isSearching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  return (
    <>
      <Suggestion
        data-size="sm"
        filter={() => true}
        multiple
        onSelectedChange={(selectedItems) =>
          setFieldValue(
            "language",
            selectedItems.map((item) => item.value),
          )
        }
        selected={selectedLanguages}
      >
        <Suggestion.Input
          aria-busy={isSearching}
          aria-invalid={errors.language ? true : undefined}
          onInput={(event) => setSearchTerm(event.currentTarget.value)}
          placeholder={`${localization.search.search}...`}
        />
        <Suggestion.List>
          <Suggestion.Empty>{emptyMessage}</Suggestion.Empty>
          {!isSearching &&
            languageOptions.map((item) => (
              <Suggestion.Option key={item.uri} value={item.uri ?? ""}>
                {getOptionLabel(item)}
              </Suggestion.Option>
            ))}
        </Suggestion.List>
      </Suggestion>
      {errors.language && (
        <ValidationMessage>{errors.language}</ValidationMessage>
      )}
    </>
  );
};
