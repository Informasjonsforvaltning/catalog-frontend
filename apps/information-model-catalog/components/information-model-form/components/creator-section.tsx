"use client";

import { InformationModel } from "@catalog-frontend/types";
import {
  SearchSuggestionSelect,
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  useDebounce,
} from "@catalog-frontend/ui";
import {
  containsNonNumberRegex,
  localization,
  onlyNumbersRegex,
} from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import {
  useSearchEnheter,
  useSearchEnheterByOrgNmbs,
} from "../../../hooks/useEnhetsregister";

export const CreatorSection = () => {
  const { setFieldValue, values } = useFormikContext<InformationModel>();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const selectedOrgNmbs = values.creator ? [values.creator] : [];
  const { data: selectedEnheter } = useSearchEnheterByOrgNmbs(selectedOrgNmbs);
  const { data: enheter, isLoading: searching } =
    useSearchEnheter(debouncedSearchTerm);

  const creatorOptions: SuggestionSelectOption[] = useMemo(
    () =>
      [
        ...new Map(
          [
            ...(selectedEnheter ?? []),
            ...(enheter ?? []),
            ...(values.creator
              ? [
                  {
                    navn:
                      selectedEnheter?.find(
                        (item) => item.organisasjonsnummer === values.creator,
                      )?.navn ??
                      enheter?.find(
                        (item) => item.organisasjonsnummer === values.creator,
                      )?.navn ??
                      null,
                    organisasjonsnummer: values.creator,
                  },
                ]
              : []),
          ].map((option) => [option.organisasjonsnummer, option]),
        ).values(),
      ].map((org) => ({
        value: org.organisasjonsnummer,
        label: org.navn ?? org.organisasjonsnummer,
        description: org.organisasjonsnummer,
      })),
    [enheter, selectedEnheter, values.creator],
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
    <Fieldset data-size="sm">
      <Fieldset.Legend>
        <TitleWithHelpTextAndTag
          helpText={localization.informationModelForm.helptext.creator}
        >
          {localization.informationModelForm.fieldLabel.creator}
        </TitleWithHelpTextAndTag>
      </Fieldset.Legend>
      <SearchSuggestionSelect
        emptyMessage={emptyMessage}
        isFetching={searching}
        onSearch={handleSearch}
        onValueChange={(value) => setFieldValue("creator", value ?? "")}
        options={creatorOptions}
        placeholder={`${localization.search.search}...`}
        value={values.creator || undefined}
      />
    </Fieldset>
  );
};
