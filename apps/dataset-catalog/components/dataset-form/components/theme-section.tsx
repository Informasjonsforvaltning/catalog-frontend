import {
  Dataset,
  DataTheme,
  LosTheme,
  Option,
  MobilityTheme,
} from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import { Combobox } from "@digdir/designsystemet-react";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { FastField, useFormikContext } from "formik";
import { get } from "lodash";

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
          {mobilityThemes
            ?.sort((a, b) =>
              (get(a.label, "nb")?.toString() ?? "").localeCompare(
                get(b.label, "nb")?.toString() ?? "",
              ),
            )
            ?.map((theme) => (
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
        {euDataThemes &&
          euDataThemes.map((theme) => (
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
        {losThemes
          ?.sort((a, b) =>
            (get(a.name, "nb")?.toString() ?? "").localeCompare(
              get(b.name, "nb")?.toString() ?? "",
            ),
          )
          ?.map((theme) => (
            <Combobox.Option key={theme.uri} value={theme.uri}>
              {getTranslateText(theme.name)}
            </Combobox.Option>
          ))}
      </FastField>
    </>
  );
};

export default ThemeSection;
