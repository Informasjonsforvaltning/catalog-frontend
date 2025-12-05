import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Combobox, EXPERIMENTAL_Suggestion as Suggestion, Field, Label, ValidationMessage } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FastField, useFormikContext } from 'formik';
import { get } from 'lodash';

type Props = {
  losThemes: LosTheme[];
  euDataThemes: DataTheme[];
};

export const ThemeSection = ({ losThemes, euDataThemes }: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const containsFilter = (inputValue: string, option: Option): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  // Convert filter function to Suggestion's filter signature
  const suggestionFilter = ({ label, input }: { label: string; input: HTMLInputElement }) => {
    return label.toLowerCase().includes(input.value.toLowerCase());
  };

  return (
    <>
      <Field id='euDataTheme-combobox' data-size='sm'>
        <Label>
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.datasetForm.helptext.euDataTheme}
          >
            {localization.datasetForm.fieldLabel.euDataTheme}
          </TitleWithHelpTextAndTag>
        </Label>
        <Suggestion
          multiple
          selected={values.euDataTheme || []}
          onSelectedChange={(items) => setFieldValue('euDataTheme', items.map((item) => item.value))}
          filter={suggestionFilter}
          data-size='sm'
        >
          <Suggestion.Input placeholder={`${localization.search.search}...`} />
          <Suggestion.List>
            <Suggestion.Empty>{localization.search.noHits}</Suggestion.Empty>
            {euDataThemes &&
              euDataThemes.map((theme) => (
                <Suggestion.Option
                  key={theme.uri}
                  value={theme.uri}
                  label={getTranslateText(theme.label) as string}
                >
                  {getTranslateText(theme.label)}
                </Suggestion.Option>
              ))}
          </Suggestion.List>
        </Suggestion>
        {errors.euDataTheme && (
          <ValidationMessage data-size='sm'>
            {errors.euDataTheme}
          </ValidationMessage>
        )}
      </Field>
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
