"use client";

import { Dataset } from "@catalog-frontend/types";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  useDebounce,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
import {
  containsNonNumberRegex,
  localization,
  onlyNumbersRegex,
} from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import {
  useSearchEnheter,
  useSearchEnheterByOrgNmbs,
} from "../../../hooks/useEnhetsregister";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";

export const QualifiedAttributionsSection = ({
  ref,
}: {
  ref: React.RefObject<HTMLInputElement>;
}) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const isMounted = useSuggestionMounted();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: selectedEnheter } = useSearchEnheterByOrgNmbs(
    values.qualifiedAttributions,
  );
  const { data: enheter, isLoading: searching } =
    useSearchEnheter(debouncedSearchTerm);

  const attributionOptions: SuggestionSelectOption[] = useMemo(
    () =>
      [
        ...new Map(
          [
            ...(selectedEnheter ?? []),
            ...(enheter ?? []),
            ...(values.qualifiedAttributions ?? []).map((orgNmb) => {
              const foundItem =
                selectedEnheter?.find(
                  (item) => item.organisasjonsnummer === orgNmb,
                ) ||
                enheter?.find((item) => item.organisasjonsnummer === orgNmb);

              return {
                navn: foundItem?.navn ?? null,
                organisasjonsnummer: foundItem?.organisasjonsnummer ?? orgNmb,
              };
            }),
          ].map((option) => [option.organisasjonsnummer, option]),
        ).values(),
      ].map((org) => ({
        value: org.organisasjonsnummer,
        label: org.navn ?? org.organisasjonsnummer,
        description: org.organisasjonsnummer,
      })),
    [enheter, selectedEnheter, values.qualifiedAttributions],
  );

  const selectedAttributions = useMemo(
    () =>
      (values.qualifiedAttributions ?? []).map((orgNmb) => {
        const option = attributionOptions.find((item) => item.value === orgNmb);

        return {
          value: orgNmb,
          label: option?.label ?? orgNmb,
        };
      }),
    [attributionOptions, values.qualifiedAttributions],
  );

  const emptyMessage = searching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const handleSearch = (term: string) => {
    const isOnlyNumbers = onlyNumbersRegex.test(term);
    const hasNonNumber = containsNonNumberRegex.test(term);

    if (isOnlyNumbers || hasNonNumber) {
      setSearchTerm(term);
    }
  };

  return (
    <div>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.qualifiedAttributions}
          >
            {localization.datasetForm.fieldLabel.qualifiedAttributions}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <SearchSuggestionSelect
          emptyMessage={emptyMessage}
          inputRef={ref}
          isFetching={searching}
          isMounted={isMounted}
          multiple
          onSearch={handleSearch}
          onSelectedChange={(selectedItems) =>
            setFieldValue(
              "qualifiedAttributions",
              selectedItems.map((item) => item.value),
            )
          }
          options={attributionOptions}
          placeholder={`${localization.search.search}...`}
          selected={selectedAttributions}
        />
      </Fieldset>
    </div>
  );
};
