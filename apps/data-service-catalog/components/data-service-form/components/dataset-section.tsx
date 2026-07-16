"use client";

import { DataService, LocalizedStrings } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import styles from "../data-service-form.module.css";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  useDebounce,
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
  useSuggestionMounted,
} from "@catalog-frontend/ui";

interface Props {
  searchEnv: string;
}

type DatasetOption = {
  uri: string;
  title?: LocalizedStrings | null;
  description?: LocalizedStrings | null;
  organization?: { prefLabel?: LocalizedStrings } | null;
};

const getDatasetLabel = (dataset: DatasetOption) =>
  dataset.title
    ? capitalizeFirstLetter(getTranslateText(dataset.title))
    : dataset.uri;

export const DatasetSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<DataService>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const isMounted = useSuggestionMounted();
  const fieldValues = values.servesDataset ?? [];
  const { data: datasetSuggestions, isFetching } = useSearchDatasetSuggestions(
    searchEnv,
    debouncedSearchTerm,
  );
  const { data: selectedDatasets } = useSearchDatasetsByUri(
    searchEnv,
    fieldValues,
  );

  const datasetOptions = useMemo((): DatasetOption[] => {
    const selected = (selectedDatasets ?? []) as DatasetOption[];
    const hits = (datasetSuggestions ?? []) as DatasetOption[];

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
        ].map((option) => [option.uri, option]),
      ).values(),
    ];
  }, [datasetSuggestions, fieldValues, selectedDatasets]);

  const datasetByUri = useMemo(
    () => new Map(datasetOptions.map((item) => [item.uri, item])),
    [datasetOptions],
  );

  const options: SuggestionSelectOption[] = useMemo(
    () =>
      datasetOptions.map((dataset) => ({
        value: dataset.uri,
        label: getDatasetLabel(dataset),
        description: capitalizeFirstLetter(
          getTranslateText(dataset.description),
        ),
      })),
    [datasetOptions],
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
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  return (
    <Fieldset data-size="sm">
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          helpText={localization.dataServiceForm.helptext.servesDataset}
          tagTitle={localization.tag.recommended}
          tagColor="info"
        >
          {localization.dataServiceForm.fieldLabel.servesDataset}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      <SearchSuggestionSelect
        emptyMessage={emptyMessage}
        isFetching={isFetching}
        isMounted={isMounted}
        multiple
        onSearch={setSearchTerm}
        onSelectedChange={(selectedItems) =>
          setFieldValue(
            "servesDataset",
            selectedItems.map((item) => item.value),
          )
        }
        options={options}
        placeholder={`${localization.search.search}...`}
        renderOption={(option) => {
          const dataset = datasetByUri.get(option.value);

          return (
            <div className={styles.comboboxOption}>
              <div>{option.label}</div>
              <div>
                {capitalizeFirstLetter(getTranslateText(dataset?.description))}
              </div>
              <div>{getTranslateText(dataset?.organization?.prefLabel)}</div>
            </div>
          );
        }}
        selected={selected}
      />
    </Fieldset>
  );
};
