"use client";

import {
  Dataset,
  DataTheme,
  LosTheme,
  MobilityTheme,
} from "@catalog-frontend/types";
import {
  SuggestionSelectOption,
  TitleWithHelpTextAndTag,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { ReactNode, useMemo } from "react";

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
  mobilityThemes?: MobilityTheme[];
  isMobility?: boolean;
};

type ThemeMultiSuggestionSelectProps = {
  ariaLabel: string;
  error?: string;
  fieldsetLegend: ReactNode;
  isMounted: boolean;
  onSelectedChange: (values: string[]) => void;
  options: SuggestionSelectOption[];
  placeholder?: string;
  selectedValues?: string[];
};

const getSelectedItems = (
  selectedValues: string[] | undefined,
  options: SuggestionSelectOption[],
): SuggestionSelectOption[] =>
  (selectedValues ?? []).map((value) => ({
    value,
    label: options.find((option) => option.value === value)?.label ?? value,
  }));

const ThemeMultiSuggestionSelect = ({
  ariaLabel,
  error,
  fieldsetLegend,
  isMounted,
  onSelectedChange,
  options,
  placeholder,
  selectedValues,
}: ThemeMultiSuggestionSelectProps) => {
  const selectedItems = getSelectedItems(selectedValues, options);

  return (
    <Fieldset data-size="sm">
      <Fieldset.Legend>{fieldsetLegend}</Fieldset.Legend>
      {isMounted ? (
        <Suggestion
          data-size="sm"
          multiple
          selected={selectedItems}
          onSelectedChange={(selectedItems) =>
            onSelectedChange(selectedItems.map((item) => item.value))
          }
        >
          <Suggestion.Input
            aria-invalid={error ? true : undefined}
            aria-label={ariaLabel}
            placeholder={placeholder}
          />
          <Suggestion.List>
            <Suggestion.Empty>{localization.search.noHits}</Suggestion.Empty>
            {options.map((option) => (
              <Suggestion.Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.label}
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      ) : (
        <Input
          data-size="sm"
          aria-invalid={error ? true : undefined}
          aria-label={ariaLabel}
          disabled
          placeholder={placeholder}
          readOnly
        />
      )}
      {error ? <ValidationMessage>{error}</ValidationMessage> : null}
    </Fieldset>
  );
};

export const ThemeSection = ({
  losThemes,
  euDataThemes,
  mobilityThemes,
  isMobility,
}: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const isMounted = useSuggestionMounted();

  const mobilityThemeOptions = useMemo(
    () =>
      mobilityThemes
        ?.sort((a, b) =>
          (get(a.label, "nb")?.toString() ?? "").localeCompare(
            get(b.label, "nb")?.toString() ?? "",
          ),
        )
        .map((theme) => ({
          value: theme.uri,
          label: getTranslateText(theme.label),
        })) ?? [],
    [mobilityThemes],
  );

  const euDataThemeOptions = useMemo(
    () =>
      euDataThemes.map((theme) => ({
        value: theme.uri,
        label: getTranslateText(theme.label),
      })),
    [euDataThemes],
  );

  const losThemeOptions = useMemo(
    () =>
      losThemes
        ?.sort((a, b) =>
          (get(a.name, "nb")?.toString() ?? "").localeCompare(
            get(b.name, "nb")?.toString() ?? "",
          ),
        )
        .map((theme) => ({
          value: theme.uri,
          label: getTranslateText(theme.name),
        })) ?? [],
    [losThemes],
  );

  return (
    <>
      {isMobility ? (
        <ThemeMultiSuggestionSelect
          ariaLabel={localization.datasetForm.fieldLabel.mobilityTheme}
          error={errors.mobilityTheme}
          fieldsetLegend={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.datasetForm.helptext.mobilityTheme}
            >
              {localization.datasetForm.fieldLabel.mobilityTheme}
            </TitleWithHelpTextAndTag>
          }
          isMounted={isMounted}
          onSelectedChange={(selectedValues) =>
            setFieldValue("mobilityTheme", selectedValues)
          }
          options={mobilityThemeOptions}
          placeholder={`${localization.search.search}...`}
          selectedValues={values.mobilityTheme}
        />
      ) : null}
      <ThemeMultiSuggestionSelect
        ariaLabel={localization.datasetForm.fieldLabel.euDataTheme}
        error={errors.euDataTheme}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            tagTitle={isMobility ? undefined : localization.tag.required}
            helpText={localization.datasetForm.helptext.euDataTheme}
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </TitleWithHelpTextAndTag>
        }
        isMounted={isMounted}
        onSelectedChange={(selectedValues) =>
          setFieldValue("euDataTheme", selectedValues)
        }
        options={euDataThemeOptions}
        placeholder={`${localization.search.search}...`}
        selectedValues={values.euDataTheme}
      />
      <ThemeMultiSuggestionSelect
        ariaLabel={localization.datasetForm.fieldLabel.losTheme}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.losTheme}
          >
            {localization.datasetForm.fieldLabel.losTheme}
          </TitleWithHelpTextAndTag>
        }
        isMounted={isMounted}
        onSelectedChange={(selectedValues) =>
          setFieldValue("losTheme", selectedValues)
        }
        options={losThemeOptions}
        placeholder={`${localization.search.search}...`}
        selectedValues={values.losTheme}
      />
    </>
  );
};

export default ThemeSection;
