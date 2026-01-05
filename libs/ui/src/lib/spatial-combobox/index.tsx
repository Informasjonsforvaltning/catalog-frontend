"use client";

import {
  useDebounce,
  useSearchAdministrativeUnits,
  useSearchAdministrativeUnitsByUri,
} from "@catalog-frontend/ui";
import { localization, getTranslateText } from "@catalog-frontend/utils";
import { Combobox } from "@digdir/designsystemet-react";
import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import { useMemo, useState } from "react";
import { useFormikContext } from "formik";

interface Props {
  referenceDataEnv: string;
}

export const SpatialCombobox = ({ referenceDataEnv }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: searchHits, isLoading: isSearching } =
    useSearchAdministrativeUnits(debouncedSearchTerm, referenceDataEnv);
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const { data: selectedValues } = useSearchAdministrativeUnitsByUri(
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
      <Combobox.Empty>{localization.search.noHits}...</Combobox.Empty>
      {comboboxOptions.map((item) => (
        <Combobox.Option
          key={item.uri}
          value={item.uri}
          description={getDescription(item)}
        >
          {item.label ? getTranslateText(item.label) : item.uri}
        </Combobox.Option>
      ))}
    </Combobox>
  );
};

const getDescription = (item: ReferenceDataCode | undefined) =>
  item
    ? item.uri.includes("geonorge")
      ? getLocationType(item.uri)
      : item.code
    : "";

const getLocationType = (uri: string): string => {
  if (uri.includes("kommune")) return localization.spatial.municipality;
  if (uri.includes("fylke")) return localization.spatial.county;
  if (uri.includes("nasjon")) return localization.spatial.country;
  return "";
};
