import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FastField, useFormikContext } from 'formik';
import styles from '../dataset-form.module.css';

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
      <div className={styles.fieldContainer}>
        <LabelWithHelpTextAndTag
          tagTitle={localization.tag.required}
          helpAriaLabel={localization.datasetForm.fieldLabel.euDataTheme}
          helpText={localization.datasetForm.helptext.euDataTheme}
        >
          {localization.datasetForm.fieldLabel.euDataTheme}
        </LabelWithHelpTextAndTag>

        <FastField
          as={Combobox}
          multiple
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
      </div>
      <div className={styles.fieldContainer}>
        <LabelWithHelpTextAndTag
          helpAriaLabel={localization.datasetForm.fieldLabel.losTheme}
          helpText={localization.datasetForm.helptext.losTheme}
        >
          {localization.datasetForm.fieldLabel.losTheme}
        </LabelWithHelpTextAndTag>

        <FastField
          as={Combobox}
          name='losTheme'
          value={values.losTheme}
          multiple
          virtual
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
      </div>
    </>
  );
};

export default ThemeSection;
