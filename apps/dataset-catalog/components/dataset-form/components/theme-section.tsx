import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
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
      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpAriaLabel={localization.datasetForm.fieldLabel.euDataTheme}
            helpText={localization.datasetForm.helptext.euDataTheme}
            fieldId='euDataTheme-combobox'
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </LabelWithHelpTextAndTag>
        }
      >
        <FastField
          id='euDataTheme-combobox'
          as={Combobox}
          multiple
          filter={containsFilter}
          placeholder={`${localization.search.search}...`}
          error={errors.euDataTheme}
          value={values.euDataTheme}
          onValueChange={(values: string[]) => setFieldValue('euDataTheme', values)}
          size='sm'
          portal={false}
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
      </Fieldset>

      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.datasetForm.fieldLabel.losTheme}
            helpText={localization.datasetForm.helptext.losTheme}
            fieldId='losTheme-combobox'
          >
            {localization.datasetForm.fieldLabel.losTheme}
          </LabelWithHelpTextAndTag>
        }
      >
        <FastField
          id='losTheme-combobox'
          as={Combobox}
          value={values.losTheme}
          multiple
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
      </Fieldset>
    </>
  );
};

export default ThemeSection;
