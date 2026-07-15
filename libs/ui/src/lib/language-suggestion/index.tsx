"use client";

import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import {
  SearchSuggestionSelect,
  useSuggestionMounted,
} from "../search-suggestion-select";
import { useDebounce } from "../use-debounce";
import {
  useSearchLanguage,
  useSearchLanguageByUri,
} from "../use-reference-data-search";

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
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const isMounted = useSuggestionMounted();
  const { data: searchHits, isFetching } = useSearchLanguage(
    debouncedSearchTerm,
    referenceDataEnv,
  );
  const { values, errors, setFieldValue } =
    useFormikContext<LanguageFormValues>();
  const { data: selectedValues } = useSearchLanguageByUri(
    values.language,
    referenceDataEnv,
  );

  const sortedSearchHits = useMemo(
    () => [...(searchHits ?? [])].sort(compareLanguages),
    [searchHits],
  );

  const languageOptions = useMemo(
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

  const suggestionOptions = useMemo(
    () =>
      languageOptions
        .filter((item): item is ReferenceDataCode & { uri: string } =>
          Boolean(item.uri),
        )
        .map((item) => ({
          value: item.uri,
          label: getTranslatedLabel(item),
        })),
    [languageOptions],
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

  const emptyMessage = isFetching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const languageError =
    typeof errors.language === "string" ? errors.language : undefined;

  return (
    <SearchSuggestionSelect
      emptyMessage={emptyMessage}
      error={languageError}
      isFetching={isFetching}
      isMounted={isMounted}
      multiple
      onSearch={setSearchTerm}
      onSelectedChange={(selectedItems) =>
        setFieldValue(
          "language",
          selectedItems.map((item) => item.value),
        )
      }
      options={suggestionOptions}
      placeholder={`${localization.search.search}...`}
      selected={selectedLanguages}
    />
  );
};
