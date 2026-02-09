"use client";

import { useMemo, useState } from "react";
import { Combobox } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import {
  useDebounce,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
} from "@catalog-frontend/ui";
import {
  localization,
  getTranslateText,
  capitalizeFirstLetter,
} from "@catalog-frontend/utils";
import styles from "./dataset-combobox.module.css";

interface Props<T extends string> {
  fieldLabel: T;
  searchEnv: string;
}

export const DatasetCombobox = <T extends string>(props: Props<T>) => {
  const { fieldLabel, searchEnv } = props;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery);
  const { setFieldValue, values } = useFormikContext<Record<T, string[]>>();
  const { data: datasetSuggestions, isLoading: searching } =
    useSearchDatasetSuggestions(searchEnv, debouncedSearchQuery);
  const { data: selectedDatasets } = useSearchDatasetsByUri(
    searchEnv,
    values[fieldLabel] || [],
  );

  const comboboxOptions = useMemo(
    () => [
      // Combine selectedDatasets and datasetSuggestions, and adding uri's for values not found in selectedDatasets
      ...new Map(
        [
          ...(selectedDatasets ?? []),
          ...(datasetSuggestions ?? []),
          ...(values[fieldLabel] ?? []).map((uri) => {
            const foundItem =
              selectedDatasets?.find((item) => item.uri === uri) ||
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
    ],
    [selectedDatasets, datasetSuggestions, values[fieldLabel]],
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
