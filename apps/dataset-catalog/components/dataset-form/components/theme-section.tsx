import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Combobox } from '@digdir/designsystemet-react';
import type { ComboboxProps } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FastField, useFormikContext } from 'formik';
import { get } from 'lodash';
import { useMemo } from 'react';

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
};

/**
 * Safe wrapper around Combobox that validates values exist in available options
 * and filters out undefined/null values to prevent runtime errors.
 */
type SafeComboboxProps = ComboboxProps & {
  /**
   * Array of valid option values to validate against
   * If provided, only values that exist in this array will be passed to Combobox
   */
  availableValues?: string[];
};

const SafeCombobox = ({ value, availableValues = [], ...props }: SafeComboboxProps) => {
  const safeValue = useMemo(() => {
    if (!value || !Array.isArray(value)) return [];

    // Filter out undefined/null/falsy values
    const filtered = value.filter((v) => v != null && v !== '' && String(v).trim() !== '');

    // If validation is enabled and we have available values, check values exist in options
    if (availableValues.length > 0) {
      return filtered.filter((v) => availableValues.includes(String(v)));
    }

    return filtered;
  }, [value, availableValues]);

  return <Combobox {...props} value={safeValue} />;
};

export const ThemeSection = ({ losThemes, euDataThemes }: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const containsFilter = (inputValue: string, option: Option): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  // Extract available theme URIs for validation
  const availableEuDataThemeUris = useMemo(
    () => euDataThemes.map((theme) => theme.uri).filter(Boolean),
    [euDataThemes],
  );

  const availableLosThemeUris = useMemo(
    () => losThemes.map((theme) => theme.uri).filter(Boolean),
    [losThemes],
  );

  return (
    <>
      <FastField
        id='euDataTheme-combobox'
        as={SafeCombobox}
        multiple
        hideClearButton
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.datasetForm.helptext.euDataTheme}
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </TitleWithHelpTextAndTag>
        }
        filter={containsFilter}
        placeholder={`${localization.search.search}...`}
        error={errors.euDataTheme}
        value={values.euDataTheme ?? []}
        availableValues={availableEuDataThemeUris}
        onValueChange={(values: string[]) => setFieldValue('euDataTheme', values)}
        data-size='sm'
      >
        <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
        {euDataThemes &&
          euDataThemes.map((theme) => (
            <Combobox.Option
              key={theme.uri}
              value={theme.uri}
            >
              {getTranslateText(theme.label)}
            </Combobox.Option>
          ))}
      </FastField>
      <FastField
        id='losTheme-combobox'
        as={SafeCombobox}
        value={values.losTheme ?? []}
        availableValues={availableLosThemeUris}
        multiple
        hideClearButton
        label={
          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.losTheme}>
            {localization.datasetForm.fieldLabel.losTheme}
          </TitleWithHelpTextAndTag>
        }
        filter={containsFilter}
        placeholder={`${localization.search.search}...`}
        onValueChange={(values: string[]) => setFieldValue('losTheme', values)}
        data-size='sm'
      >
        <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
        {losThemes
          ?.sort((a, b) => (get(a.name, 'nb')?.toString() ?? '').localeCompare(get(b.name, 'nb')?.toString() ?? ''))
          ?.map((theme) => (
            <Combobox.Option
              key={theme.uri}
              value={theme.uri}
            >
              {getTranslateText(theme.name)}
            </Combobox.Option>
          ))}
      </FastField>
    </>
  );
};

export default ThemeSection;
