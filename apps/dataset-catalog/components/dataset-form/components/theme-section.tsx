"use client";

import {
  Dataset,
  DataTheme,
  LosTheme,
  MobilityTheme,
} from "@catalog-frontend/types";
import {
  MultiSuggestionSelect,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { get } from "lodash";
import { useMemo } from "react";

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
  mobilityThemes?: MobilityTheme[];
  isMobility?: boolean;
};

export const ThemeSection = ({
  losThemes,
  euDataThemes,
  mobilityThemes,
  isMobility,
}: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();

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
        <MultiSuggestionSelect
          ariaLabel={localization.datasetForm.fieldLabel.mobilityTheme}
          emptyMessage={localization.search.noHits}
          error={
            typeof errors.mobilityTheme === "string"
              ? errors.mobilityTheme
              : undefined
          }
          fieldsetLegend={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.datasetForm.helptext.mobilityTheme}
            >
              {localization.datasetForm.fieldLabel.mobilityTheme}
            </TitleWithHelpTextAndTag>
          }
          onSelectedChange={(selectedValues) =>
            setFieldValue("mobilityTheme", selectedValues)
          }
          options={mobilityThemeOptions}
          placeholder={`${localization.search.search}...`}
          selectedValues={values.mobilityTheme}
        />
      ) : null}
      <MultiSuggestionSelect
        ariaLabel={localization.datasetForm.fieldLabel.euDataTheme}
        emptyMessage={localization.search.noHits}
        error={
          typeof errors.euDataTheme === "string"
            ? errors.euDataTheme
            : undefined
        }
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            tagTitle={isMobility ? undefined : localization.tag.required}
            helpText={localization.datasetForm.helptext.euDataTheme}
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </TitleWithHelpTextAndTag>
        }
        onSelectedChange={(selectedValues) =>
          setFieldValue("euDataTheme", selectedValues)
        }
        options={euDataThemeOptions}
        placeholder={`${localization.search.search}...`}
        selectedValues={values.euDataTheme}
      />
      <MultiSuggestionSelect
        ariaLabel={localization.datasetForm.fieldLabel.losTheme}
        emptyMessage={localization.search.noHits}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.losTheme}
          >
            {localization.datasetForm.fieldLabel.losTheme}
          </TitleWithHelpTextAndTag>
        }
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
