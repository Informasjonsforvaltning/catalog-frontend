"use client";

import { LocalizedStrings } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
  useSuggestionMounted,
} from "../search-suggestion-select";
import { useDebounce } from "../use-debounce";
import {
  useSearchConceptsByUri,
  useSearchConceptSuggestions,
} from "../use-search-service";
import styles from "./concept-suggestion-select.module.css";

interface Props<T extends string> {
  fieldLabel: T;
  searchEnv: string;
}

type ConceptOption = {
  uri: string;
  title?: LocalizedStrings;
  description?: LocalizedStrings;
  organization?: { prefLabel?: LocalizedStrings };
};

const getConceptLabel = (concept: ConceptOption) =>
  concept.title
    ? capitalizeFirstLetter(getTranslateText(concept.title))
    : concept.uri;

export const ConceptSuggestionSelect = <T extends string>(props: Props<T>) => {
  const { fieldLabel, searchEnv } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const isMounted = useSuggestionMounted();
  const { setFieldValue, values } = useFormikContext<Record<T, string[]>>();
  const fieldValues = values[fieldLabel] ?? [];
  const { data: searchHits, isFetching } = useSearchConceptSuggestions(
    searchEnv,
    debouncedSearchQuery,
  );
  const { data: selectedConcepts } = useSearchConceptsByUri(
    searchEnv,
    fieldValues,
  );

  const conceptOptions = useMemo((): ConceptOption[] => {
    const selected = (selectedConcepts ?? []) as ConceptOption[];
    const hits = (searchHits ?? []) as ConceptOption[];

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
        ].map((item) => [item.uri, item]),
      ).values(),
    ];
  }, [fieldValues, searchHits, selectedConcepts]);

  const conceptByUri = useMemo(
    () => new Map(conceptOptions.map((item) => [item.uri, item])),
    [conceptOptions],
  );

  const options: SuggestionSelectOption[] = useMemo(
    () =>
      conceptOptions.map((concept) => ({
        value: concept.uri,
        label: getConceptLabel(concept),
        description: capitalizeFirstLetter(
          getTranslateText(concept.description),
        ),
      })),
    [conceptOptions],
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
    : debouncedSearchQuery
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  return (
    <SearchSuggestionSelect
      emptyMessage={emptyMessage}
      isFetching={isFetching}
      isMounted={isMounted}
      multiple
      onSearch={setSearchQuery}
      onSelectedChange={(selectedItems) =>
        setFieldValue(
          fieldLabel,
          selectedItems.map((item) => item.value),
        )
      }
      options={options}
      placeholder={`${localization.search.search}...`}
      renderOption={(option) => {
        const concept = conceptByUri.get(option.value);

        return (
          <div className={styles.option}>
            <div>{option.label}</div>
            <div>
              {capitalizeFirstLetter(getTranslateText(concept?.description))}
            </div>
            <div>{getTranslateText(concept?.organization?.prefLabel)}</div>
          </div>
        );
      }}
      selected={selected}
    />
  );
};
