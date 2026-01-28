import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag, SafeCombobox } from '@catalog-frontend/ui';
import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FastField, useFormikContext } from 'formik';
import { get } from 'lodash';
import { useMemo } from 'react';

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
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
