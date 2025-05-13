import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FastField, useFormikContext } from 'formik';

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
};

export const ThemeSection = ({ losThemes, euDataThemes }: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const containsFilter = (inputValue: string, option: Option): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <>
      <FastField
        id='euDataTheme-combobox'
        as={Combobox}
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
        value={values.euDataTheme}
        onValueChange={(values: string[]) => setFieldValue('euDataTheme', values)}
        size='sm'
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
        as={Combobox}
        value={values.losTheme}
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
        size='sm'
      >
        <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
        {losThemes?.map((theme) => (
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
