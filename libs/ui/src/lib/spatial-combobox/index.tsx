"use client";

import {
  useDebounce,
  useSearchGeoNamesAndEULocations,
  useSearchLocationsByUri,
} from "@catalog-frontend/ui";
import { localization, getTranslateText } from "@catalog-frontend/utils";
import { Combobox } from "@digdir/designsystemet-react";
import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import { useMemo, useState } from "react";
import { useFormikContext } from "formik";

interface Props {
  referenceDataEnv: string;
}

// Zero-width space to prevent auto-selection when input matches label exactly
const INVISIBLE_CHARACTER = "\u200B";

export const SpatialCombobox = ({ referenceDataEnv }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: searchHits, isLoading: isSearching } =
    useSearchGeoNamesAndEULocations(debouncedSearchTerm, referenceDataEnv);
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const { data: selectedValues } = useSearchLocationsByUri(
    values?.spatial,
    referenceDataEnv,
  );

  const comboboxOptions: ReferenceDataCode[] = useMemo(
    () => [
      // Combine selectedValues, searchHits, and values (mapped with uri-only fallback)
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
              label: foundItem?.label ?? undefined,
              code: getDescription(foundItem),
            };
          }),
        ].map((item) => [item.uri, item]),
      ).values(),
    ],
    [selectedValues, searchHits, values.spatial],
  );

  return (
    <Combobox
      placeholder={`${localization.search.search}...`}
      multiple
      hideClearButton
      filter={() => true} // results are already filtered
      size="sm"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(event.target.value)
      }
      onValueChange={(selectedValues) =>
        setFieldValue("spatial", selectedValues)
      }
      value={values.spatial || []}
      virtual
      loading={isSearching}
      error={errors.spatial}
    >
      <Combobox.Empty>
        {debouncedSearchTerm
          ? localization.search.noHits
          : `${localization.search.typeToSearch}...`}
      </Combobox.Empty>
      {comboboxOptions.map((item) => (
        <Combobox.Option
          key={item.uri}
          value={item.uri}
          description={getDescription(item)}
        >
          {INVISIBLE_CHARACTER}
          {item.label ? getTranslateText(item.label) : item.uri}
        </Combobox.Option>
      ))}
    </Combobox>
  );
};

const getDescription = (item: ReferenceDataCode | undefined) =>
  item ? (item.subType ? getLocationType(item.subType) : item.code) : "";

const getLocationType = (subType: string): string => {
  if (subType.includes("KOMMUNE")) return localization.spatial.municipality;
  if (subType.includes("FYLKE")) return localization.spatial.county;
  if (subType.includes("COUNTRY")) return localization.spatial.country;
  if (subType.includes("CONTINENT")) return localization.spatial.continent;
  return subType;
};
