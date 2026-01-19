"use client";

import { useMemo, useState } from "react";
import { Combobox } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import {
  useDebounce,
  useSearchConceptsByUri,
  useSearchConceptSuggestions,
} from "@catalog-frontend/ui";
import {
  localization,
  getTranslateText,
  capitalizeFirstLetter,
} from "@catalog-frontend/utils";
import styles from "./concept-combobox.module.css";

interface Props<T extends string> {
  fieldLabel: T;
  searchEnv: string;
}

export const ConceptCombobox = <T extends string>(props: Props<T>) => {
  const { fieldLabel, searchEnv } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const { setFieldValue, values } = useFormikContext<Record<T, string[]>>();
  const { data: searchHits, isLoading: searching } =
    useSearchConceptSuggestions(searchEnv, debouncedSearchQuery);
  const { data: selectedConcepts } = useSearchConceptsByUri(
    searchEnv,
    values[fieldLabel] ?? [],
  );

  const comboboxOptions = useMemo(
    () => [
      // Safely handle the default values
      ...new Map(
        [
          ...(selectedConcepts ?? []),
          ...(searchHits ?? []),
          ...(values[fieldLabel] ?? []).map((uri) => {
            const foundItem =
              selectedConcepts?.find((item) => item.uri === uri) ||
              searchHits?.find((item: { uri: string }) => item.uri === uri);
            return {
              uri,
              title: foundItem?.title ?? undefined,
              description: foundItem?.description ?? undefined,
              organization: foundItem?.organization ?? undefined,
            };
          }),
        ].map((item) => [item.uri, item]),
      ).values(),
    ],
    [selectedConcepts, searchHits, values[fieldLabel]],
  );

  return (
    <Combobox
      filter={() => true} // results are already filtered
      hideClearButton
      loading={searching}
      multiple
      onValueChange={(selectedValues) =>
        setFieldValue(fieldLabel, selectedValues)
      }
      onChange={(input) => setSearchQuery(input.target.value)}
      placeholder={`${localization.search.search}...`}
      size="sm"
      value={values[fieldLabel] || []}
      virtual
    >
      <Combobox.Empty>
        {debouncedSearchQuery
          ? localization.search.noHits
          : `${localization.search.typeToSearch}...`}
      </Combobox.Empty>
      {comboboxOptions.map((option) => (
        <Combobox.Option
          value={option.uri}
          key={option.uri}
          displayValue={
            option.title
              ? capitalizeFirstLetter(getTranslateText(option.title))
              : option.uri
          }
        >
          <div className={styles.comboboxOption}>
            <div>
              {option.title
                ? capitalizeFirstLetter(getTranslateText(option.title))
                : option.uri}
            </div>
            <div>
              {capitalizeFirstLetter(getTranslateText(option.description))}
            </div>
            <div>{getTranslateText(option.organization?.prefLabel)}</div>
          </div>
        </Combobox.Option>
      ))}
    </Combobox>
  );
};
