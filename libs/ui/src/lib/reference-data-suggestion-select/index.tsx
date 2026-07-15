"use client";

import { getTranslateText, localization } from "@catalog-frontend/utils";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { Ref, useMemo } from "react";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
  useSuggestionMounted,
} from "../search-suggestion-select";

interface Props {
  selectedValuesSearchHits: ReferenceDataCode[];
  querySearchHits: ReferenceDataCode[];
  formikValues: string[];
  onSearch: (value: string) => void;
  onValueChange: (values: string[]) => void;
  isFetching?: boolean;
  showCodeAsDescription?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  placeholder?: string;
}

export function ReferenceDataSuggestionSelect({
  formikValues,
  selectedValuesSearchHits,
  querySearchHits,
  onSearch,
  onValueChange,
  isFetching = false,
  showCodeAsDescription = false,
  inputRef,
  error,
  placeholder = `${localization.search.search}...`,
}: Props) {
  const isMounted = useSuggestionMounted();

  const referenceDataOptions = useMemo(
    () => [
      ...new Map(
        [
          ...(selectedValuesSearchHits ?? []),
          ...(querySearchHits ?? []),
          ...(formikValues ?? []).map((uri) => {
            const foundItem =
              selectedValuesSearchHits?.find((item) => item.uri === uri) ||
              querySearchHits?.find((item) => item.uri === uri);

            return {
              uri,
              label: foundItem?.label,
              code: foundItem?.code,
            };
          }),
        ].map((item) => [item.uri, item]),
      ).values(),
    ],
    [formikValues, querySearchHits, selectedValuesSearchHits],
  );

  const options: SuggestionSelectOption[] = useMemo(
    () =>
      referenceDataOptions
        .filter((item): item is ReferenceDataCode & { uri: string } =>
          Boolean(item.uri),
        )
        .map((item) => ({
          value: item.uri,
          label: item.label ? getTranslateText(item.label) : item.uri,
          description: showCodeAsDescription ? item.code : undefined,
        })),
    [referenceDataOptions, showCodeAsDescription],
  );

  const selected: SuggestionSelectOption[] = useMemo(
    () =>
      (formikValues ?? []).map((uri) => {
        const option = options.find((item) => item.value === uri);

        return {
          value: uri,
          label: option?.label ?? uri,
          description: option?.description,
        };
      }),
    [formikValues, options],
  );

  return (
    <SearchSuggestionSelect
      emptyMessage={localization.search.noHits}
      error={error}
      inputRef={inputRef}
      isFetching={isFetching}
      isMounted={isMounted}
      multiple
      onSearch={onSearch}
      onSelectedChange={(selectedItems) =>
        onValueChange(selectedItems.map((item) => item.value))
      }
      options={options}
      placeholder={placeholder}
      selected={selected}
    />
  );
}

export default ReferenceDataSuggestionSelect;
