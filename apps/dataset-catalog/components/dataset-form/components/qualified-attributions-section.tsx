import { Dataset } from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import {
  containsNonNumberRegex,
  localization,
  onlyNumbersRegex,
} from "@catalog-frontend/utils";
import { Box, Combobox, Fieldset } from "@digdir/designsystemet-react";
import {
  useSearchEnheter,
  useSearchEnheterByOrgNmbs,
} from "../../../hooks/useEnhetsregister";
import { useFormikContext } from "formik";
import { debounce } from "lodash";
import { RefObject, useCallback, useState } from "react";

export const QualifiedAttributionsSection = ({
  ref,
}: {
  ref: RefObject<HTMLInputElement>;
}) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: selectedEnheter } = useSearchEnheterByOrgNmbs(
    values.qualifiedAttributions,
  );
  const { data: enheter, isLoading: searching } = useSearchEnheter(searchTerm);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const isOnlyNumbers = onlyNumbersRegex.test(term);
      const hasNonNumber = containsNonNumberRegex.test(term);
      if (isOnlyNumbers || hasNonNumber) {
        setSearchTerm(term);
      }
    }, 300),
    [searchTerm],
  );

  const comboboxOptions = [
    ...new Map(
      [
        ...(selectedEnheter ?? []),
        ...(enheter ?? []),
        ...(values.qualifiedAttributions ?? []).map((orgNmb) => {
          const foundItem =
            selectedEnheter?.find(
              (item) => item.organisasjonsnummer === orgNmb,
            ) || enheter?.find((item) => item.organisasjonsnummer === orgNmb);

          return {
            navn: foundItem?.navn ?? null,
            organisasjonsnummer: foundItem?.organisasjonsnummer ?? orgNmb,
          };
        }),
      ].map((option) => [option.organisasjonsnummer, option]),
    ).values(),
  ];

  return (
    <Box>
      <Fieldset
        size="sm"
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.qualifiedAttributions}
          >
            {localization.datasetForm.fieldLabel.qualifiedAttributions}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          size="sm"
          onValueChange={(selectedValues: string[]) =>
            setFieldValue("qualifiedAttributions", selectedValues)
          }
          onChange={(input: any) => debouncedSearch(input.target.value)}
          loading={searching}
          multiple
          value={values.qualifiedAttributions}
          placeholder={`${localization.search.search}...`}
          filter={() => true} // Deactivate filter, handled by backend
          virtual
          ref={ref}
        >
          <Combobox.Empty>{`${localization.search.noHits}...`}</Combobox.Empty>
          {comboboxOptions.map((org) => (
            <Combobox.Option
              value={org.organisasjonsnummer}
              key={org.organisasjonsnummer}
              description={org.organisasjonsnummer}
            >
              {org.navn}
            </Combobox.Option>
          ))}
        </Combobox>
      </Fieldset>
    </Box>
  );
};
