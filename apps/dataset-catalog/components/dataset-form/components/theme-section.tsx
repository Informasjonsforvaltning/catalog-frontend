import {
  Dataset,
  DataTheme,
  LosTheme,
  Option,
  MobilityTheme,
} from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag, SafeCombobox } from "@catalog-frontend/ui-v2";
import { Combobox } from "@digdir/designsystemet-react";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { FastField, useFormikContext } from "formik";
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
  const containsFilter = (inputValue: string, option: Option): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  //TODO: reuseable themes mapping function

  //map mobility themes with uri as key and theme as value. Add unique items from values.mobilityTheme
  const mobilityThemeMap = useMemo(() => {
    // Map from existing mobilityThemes by uri
    const map = new Map<string, MobilityTheme>();
    mobilityThemes?.forEach((theme) => {
      if (theme?.uri) {
        map.set(theme.uri, theme);
      }
    });
    // If formik values already exist, add their items if not present and structure fits
    const selectedUris: string[] = Array.isArray(values?.mobilityTheme)
      ? values.mobilityTheme
      : [];
    selectedUris.forEach((uri) => {
      if (uri && !map.has(uri)) {
        // Add a mock theme with only uri if not found in the original list
        map.set(uri, { uri } as MobilityTheme);
      }
    });
    return map;
  }, [mobilityThemes, values?.mobilityTheme]);

  //map eu themes with uri as key and theme as value. Add unique items from values.euDataThemes
  const euThemeMap = useMemo(() => {
    // Map from existing euDataThemes by uri
    const map = new Map<string, DataTheme>();
    euDataThemes?.forEach((theme) => {
      if (theme?.uri) {
        map.set(theme.uri, theme);
      }
    });
    // If formik values already exist, add their items if not present and structure fits
    const selectedUris: string[] = Array.isArray(values?.euDataTheme)
      ? values.euDataTheme
      : [];
    selectedUris.forEach((uri) => {
      if (uri && !map.has(uri)) {
        // Add a mock theme with only uri if not found in the original list
        map.set(uri, { uri } as DataTheme);
      }
    });
    return map;
  }, [euDataThemes, values?.euDataTheme]);

  //map los themes with uri as key and theme as value. Add unique items from values.losTheme
  const losThemeMap = useMemo(() => {
    // Map from existing losThemes by uri
    const map = new Map<string, LosTheme>();
    losThemes?.forEach((theme) => {
      if (theme?.uri) {
        map.set(theme.uri, theme);
      }
    });
    // If formik values already exist, add their items if not present and structure fits
    const selectedUris: string[] = Array.isArray(values?.losTheme)
      ? values.losTheme
      : [];
    selectedUris.forEach((uri) => {
      if (uri && !map.has(uri)) {
        // Add a mock theme with only uri if not found in the original list
        map.set(uri, { uri } as LosTheme);
      }
    });
    return map;
  }, [losThemes, values?.losTheme]);

  return (
    <>
      {isMobility ? (
        <FastField
          id="mobilityTheme-combobox"
          as={Combobox}
          value={values.mobilityTheme}
          multiple
          hideClearButton
          label={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.datasetForm.helptext.mobilityTheme}
            >
              {localization.datasetForm.fieldLabel.mobilityTheme}
            </TitleWithHelpTextAndTag>
          }
          filter={containsFilter}
          placeholder={`${localization.search.search}...`}
          onValueChange={(values: string[]) =>
            setFieldValue("mobilityTheme", values)
          }
          error={errors.mobilityTheme}
          size="sm"
        >
          <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
          {Array.from(mobilityThemeMap.values())
            .sort((a, b) =>
              (get(a.label, "nb")?.toString() ?? "").localeCompare(
                get(b.label, "nb")?.toString() ?? "",
              ),
            )
            .map((theme) => (
              <Combobox.Option key={theme.uri} value={theme.uri}>
                {getTranslateText(theme.label)}
              </Combobox.Option>
            ))}
        </FastField>
      ) : undefined}
      <FastField
        id="euDataTheme-combobox"
        as={Combobox}
        multiple
        hideClearButton
        label={
          <TitleWithHelpTextAndTag
            tagTitle={isMobility ? undefined : localization.tag.required}
            helpText={localization.datasetForm.helptext.euDataTheme}
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </TitleWithHelpTextAndTag>
        }
        filter={containsFilter}
        placeholder={`${localization.search.search}...`}
        error={errors.euDataTheme}
        value={values.euDataTheme}
        onValueChange={(values: string[]) =>
          setFieldValue("euDataTheme", values)
        }
        size="sm"
      >
        <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
        {Array.from(euThemeMap.values())
          .sort((a, b) =>
            (get(a.label, "nb")?.toString() ?? "").localeCompare(
              get(b.label, "nb")?.toString() ?? "",
            ),
          )
          .map((theme) => (
            <Combobox.Option key={theme.uri} value={theme.uri}>
              {getTranslateText(theme.label)}
            </Combobox.Option>
          ))}
      </FastField>
      <FastField
        id="losTheme-combobox"
        as={Combobox}
        value={values.losTheme}
        multiple
        hideClearButton
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.losTheme}
          >
            {localization.datasetForm.fieldLabel.losTheme}
          </TitleWithHelpTextAndTag>
        }
        filter={containsFilter}
        placeholder={`${localization.search.search}...`}
        onValueChange={(values: string[]) => setFieldValue("losTheme", values)}
        size="sm"
      >
        <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
        {Array.from(losThemeMap.values())
          .sort((a, b) =>
            (get(a.name, "nb")?.toString() ?? "").localeCompare(
              get(b.name, "nb")?.toString() ?? "",
            ),
          )
          .map((theme) => (
            <Combobox.Option key={theme.uri} value={theme.uri}>
              {getTranslateText(theme.name)}
            </Combobox.Option>
          ))}
      </FastField>
    </>
  );
};

export default ThemeSection;
