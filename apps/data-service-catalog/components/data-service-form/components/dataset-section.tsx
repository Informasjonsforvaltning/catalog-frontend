"use client";
import { DataService } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Box, Combobox, Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import styles from "../data-service-form.module.css";
import {
  useSearchDatasetsByUri,
  useSearchDatasetSuggestions,
} from "../../../hooks/useSearchService";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui";

interface Props {
  searchEnv: string;
}

export const DatasetSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<DataService>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: datasetSuggestions, isLoading: searching } =
    useSearchDatasetSuggestions(searchEnv, searchTerm);
  const { data: selectedDatasets, isLoading } = useSearchDatasetsByUri(
    searchEnv,
    values.servesDataset || [],
  );

  const comboboxOptions = [
    // Combine selectedDatasets and datasetSuggestions, and adding uri's for values not found in selectedDatasets
    ...new Map(
      [
        ...(selectedDatasets ?? []),
        ...(datasetSuggestions ?? []),
        ...(values.servesDataset ?? []).map((uri) => {
          const foundItem =
            selectedDatasets?.find((item) => item.uri === uri) ||
            datasetSuggestions?.find((item: any) => item.uri === uri);

          return {
            uri,
            title: foundItem?.title ?? null,
            description: foundItem?.description ?? null,
            organization: foundItem?.organization ?? null,
          };
        }),
      ].map((option) => [option.uri, option]),
    ).values(),
  ];

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [],
  );

  return (
    <Box>
      {!isLoading && (
        <Fieldset
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.dataServiceForm.helptext.servesDataset}
              tagTitle={localization.tag.recommended}
              tagColor="info"
            >
              {localization.dataServiceForm.fieldLabel.servesDataset}
            </TitleWithHelpTextAndTag>
          }
          size="sm"
        >
          <Combobox
            size="sm"
            onValueChange={(selectedValues: string[]) =>
              setFieldValue("servesDataset", selectedValues)
            }
            onChange={(input: any) => debouncedSearch(input.target.value)}
            loading={searching}
            multiple
            hideClearButton
            value={values.servesDataset}
            placeholder={`${localization.search.search}...`}
            filter={() => true} // Deactivate filter, handled by backend
          >
            <Combobox.Empty>{`${localization.search.noHits}...`}</Combobox.Empty>
            {comboboxOptions &&
              comboboxOptions.map((suggestion) => (
                <Combobox.Option
                  value={suggestion.uri}
                  key={suggestion.uri}
                  displayValue={
                    suggestion.title
                      ? capitalizeFirstLetter(
                          getTranslateText(suggestion.title) as string,
                        )
                      : suggestion.uri
                  }
                >
                  <div className={styles.comboboxOption}>
                    <div>
                      {capitalizeFirstLetter(
                        getTranslateText(suggestion.title) as string,
                      ) ?? suggestion.uri}
                    </div>
                    <div>
                      {capitalizeFirstLetter(
                        getTranslateText(suggestion.description) as string,
                      ) ?? ""}
                    </div>
                    <div>
                      {getTranslateText(suggestion.organization?.prefLabel) ??
                        ""}
                    </div>
                  </div>
                </Combobox.Option>
              ))}
          </Combobox>
        </Fieldset>
      )}
    </Box>
  );
};
