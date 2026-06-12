"use client";
import { Dataset, Search } from "@catalog-frontend/types";
import {
  TitleWithHelpTextAndTag,
  useDebounce,
  useSearchInformationModelsByUri,
  useSearchInformationModelsSuggestions,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
} from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import styles from "../dataset-form.module.css";
import { UriWithLabelFieldsetTable } from "./uri-with-label-field-set-table";

interface Props {
  searchEnv: string;
}

interface InformationModelOption {
  uri: string;
  title?: Search.Suggestion["title"] | null;
  description?: Search.Suggestion["description"] | null;
  organization?: Search.Suggestion["organization"] | null;
}

const getOptionLabel = (option: InformationModelOption) =>
  capitalizeFirstLetter(getTranslateText(option.title)) || option.uri;

export const InformationModelSection = ({ searchEnv }: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const { data: informationModelSuggestions, isLoading: searching } =
    useSearchInformationModelsSuggestions(searchEnv, debouncedSearchTerm);
  const { data: selectedInformationModels, isLoading } =
    useSearchInformationModelsByUri(
      searchEnv,
      values.informationModelsFromFDK || [],
    );

  const informationModelOptions: InformationModelOption[] = useMemo(
    () => [
      // Combine selectedInformationModels and informationModelSuggestions, and adding uri's for values not found in selectedInformationModels
      ...new Map(
        [
          ...(selectedInformationModels ?? []),
          ...(informationModelSuggestions ?? []),
          ...(values.informationModelsFromFDK ?? []).map((uri) => {
            const foundItem =
              selectedInformationModels?.find((item) => item.uri === uri) ||
              informationModelSuggestions?.find((item) => item.uri === uri);

            return {
              uri,
              title: foundItem?.title ?? null,
              description: foundItem?.description ?? null,
              organization: foundItem?.organization ?? null,
            };
          }),
        ].map((option) => [option.uri, option] as const),
      ).values(),
    ],
    [
      selectedInformationModels,
      informationModelSuggestions,
      values.informationModelsFromFDK,
    ],
  );

  const selectedInformationModelItems = useMemo(
    () =>
      (values.informationModelsFromFDK ?? []).map((uri) => {
        const option = informationModelOptions.find((item) => item.uri === uri);

        return {
          value: uri,
          label: option ? getOptionLabel(option) : uri,
        };
      }),
    [informationModelOptions, values.informationModelsFromFDK],
  );

  const emptyMessage = searching
    ? `${localization.loading}...`
    : debouncedSearchTerm
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  return (
    <>
      {!isLoading && (
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={
                localization.datasetForm.helptext.informationModelsFromFDK
              }
            >
              {localization.datasetForm.fieldLabel.informationModelsFromFDK}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <Suggestion
            data-size="sm"
            filter={() => true} // Deactivate filter, handled by backend
            multiple
            onSelectedChange={(selectedItems) =>
              setFieldValue(
                "informationModelsFromFDK",
                selectedItems.map((item) => item.value),
              )
            }
            selected={selectedInformationModelItems}
          >
            <Suggestion.Input
              aria-busy={searching}
              onInput={(event) => setSearchTerm(event.currentTarget.value)}
              placeholder={`${localization.search.search}...`}
            />
            <Suggestion.List>
              <Suggestion.Empty>{emptyMessage}</Suggestion.Empty>
              {!searching &&
                informationModelOptions.map((suggestion) => (
                  <Suggestion.Option
                    value={suggestion.uri}
                    key={suggestion.uri}
                    label={getOptionLabel(suggestion)}
                  >
                    <div className={styles.comboboxOption}>
                      <div>{getOptionLabel(suggestion)}</div>
                      <div>
                        {capitalizeFirstLetter(
                          getTranslateText(suggestion.description),
                        )}
                      </div>
                      <div>
                        {getTranslateText(suggestion.organization?.prefLabel)}
                      </div>
                    </div>
                  </Suggestion.Option>
                ))}
            </Suggestion.List>
          </Suggestion>
        </Fieldset>
      )}

      <UriWithLabelFieldsetTable
        fieldName="informationModelsFromOtherSources"
        errors={errors.informationModelsFromOtherSources}
        label={
          <TitleWithHelpTextAndTag
            helpText={
              localization.datasetForm.helptext
                .informationModelsFromOtherSources
            }
          >
            {
              localization.datasetForm.fieldLabel
                .informationModelsFromOtherSources
            }
          </TitleWithHelpTextAndTag>
        }
      />
    </>
  );
};
