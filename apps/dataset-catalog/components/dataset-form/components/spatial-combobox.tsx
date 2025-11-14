import {
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
} from "@catalog-frontend/ui";
import { localization, getTranslateText } from "@catalog-frontend/utils";
import {
  Box,
  Combobox,
  Textfield,
  Fieldset,
} from "@digdir/designsystemet-react";
import { FastField } from "formik";
import { FieldsetDivider } from "@catalog-frontend/ui";
import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import {
  useSearchAdministrativeUnits,
  useSearchAdministrativeUnitsByUri,
} from "../../../hooks/useReferenceDataSearch";
import { useCallback, useState } from "react";
import { useFormikContext } from "formik";
import { debounce, sortBy } from "lodash";

interface Props {
  referenceDataEnv: string;
  isMobility?: boolean;
}

export const SpatialCombobox = ({ referenceDataEnv, isMobility }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: searchHits, isLoading: isSearching } =
    useSearchAdministrativeUnits(searchTerm, referenceDataEnv);
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const { data: selectedValues } = useSearchAdministrativeUnitsByUri(
    values?.spatial,
    referenceDataEnv,
  );
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
  const comboboxOptions: ReferenceDataCode[] = [
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
  ];
  const debouncedSetSearchTerm = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);
  const handleSearchChange = useCallback(
    (input: any) => {
      debouncedSetSearchTerm(input.target.value);
    },
    [searchTerm],
  );

  return (
    <>
      <Fieldset
        size="sm"
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={
              isMobility
                ? localization.tag.required
                : localization.tag.recommended
            }
            tagColor={isMobility ? undefined : "info"}
            helpText={localization.datasetForm.helptext.spatial}
          >
            {localization.datasetForm.fieldLabel.spatial}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          placeholder={`${localization.search.search}...`}
          multiple
          hideClearButton
          filter={() => true} // disable filter
          size="sm"
          onChange={handleSearchChange}
          onValueChange={(selectedValues) =>
            setFieldValue("spatial", selectedValues)
          }
          value={values.spatial || []}
          virtual
          loading={isSearching}
          error={errors.spatial}
        >
          <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
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
      </Fieldset>
    </>
  );
};
