"use client";

import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
} from "../search-suggestion-select";
import { useDebounce } from "../use-debounce";
import {
  useSearchGeoNamesAndEULocations,
  useSearchLocationsByUri,
} from "../use-reference-data-search";

interface Props {
  referenceDataEnv: string;
}

const getLocationType = (subType: string): string => {
  if (subType.includes("KOMMUNE")) return localization.spatial.municipality;
  if (subType.includes("FYLKE")) return localization.spatial.county;
  if (subType.includes("COUNTRY")) return localization.spatial.country;
  if (subType.includes("CONTINENT")) return localization.spatial.continent;
  return subType;
};

const getDescription = (item: ReferenceDataCode | undefined) =>
  item
    ? item.subType
      ? getLocationType(item.subType)
      : (item.code ?? "")
    : "";

export const SpatialSuggestionSelect = ({ referenceDataEnv }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: searchHits, isFetching } = useSearchGeoNamesAndEULocations(
    debouncedSearchTerm,
    referenceDataEnv,
  );
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const { data: selectedValues } = useSearchLocationsByUri(
    values.spatial,
    referenceDataEnv,
  );

  const locationOptions = useMemo(
    () => [
      ...new Map(
        [
          ...(selectedValues ?? []),
          ...(searchHits ?? []),
          ...(values.spatial ?? []).map((uri) => {
            const foundItem =
              selectedValues?.find((item) => item.uri === uri) ||
              searchHits?.find((item) => item.uri === uri);

            return {
              uri,
              label: foundItem?.label,
              code: foundItem?.code,
              subType: foundItem?.subType,
            };
          }),
        ].map((item) => [item.uri, item]),
      ).values(),
    ],
    [searchHits, selectedValues, values.spatial],
  );

  const options: SuggestionSelectOption[] = useMemo(
    () =>
      locationOptions
        .filter((item): item is ReferenceDataCode & { uri: string } =>
          Boolean(item.uri),
        )
        .map((item) => ({
          value: item.uri,
          label: item.label ? getTranslateText(item.label) : item.uri,
          description: getDescription(item) || undefined,
        })),
    [locationOptions],
  );

  const selected: SuggestionSelectOption[] = useMemo(
    () =>
      (values.spatial ?? []).map((uri) => {
        const option = options.find((item) => item.value === uri);

        return {
          value: uri,
          label: option?.label ?? uri,
          description: option?.description,
        };
      }),
    [options, values.spatial],
  );

  const emptyMessage = isFetching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const spatialError =
    typeof errors.spatial === "string" ? errors.spatial : undefined;

  return (
    <SearchSuggestionSelect
      emptyMessage={emptyMessage}
      error={spatialError}
      isFetching={isFetching}
      multiple
      onSearch={setSearchTerm}
      onSelectedChange={(selectedItems) =>
        setFieldValue(
          "spatial",
          selectedItems.map((item) => item.value),
        )
      }
      options={options}
      placeholder={`${localization.search.search}...`}
      selected={selected}
    />
  );
};
