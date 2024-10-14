import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';

import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Field, useFormikContext } from 'formik';
import styles from './dataset-form.module.css';

type Props = {
  losThemes: LosTheme[];
  dataThemes: DataTheme[];
};

export const ThemeSection = ({ losThemes, dataThemes }: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();

  const getNameFromLosPath = (path: string): string | string[] => {
    const obj = losThemes?.find((obj) => obj.losPaths.includes(path));
    return obj ? getTranslateText(obj.name) : [];
  };

  const getParentNames = (inputPaths: string[]): string => {
    const results: string[] = [];

    inputPaths.forEach((path) => {
      const parts = path.split('/').slice(0, -1);
      const parentPath = parts.slice(0, -1).join('/');
      const childPath = parts.join('/');

      const parentName = getNameFromLosPath(parentPath);
      const childName = getNameFromLosPath(childPath);

      const formattedResult = `${parentName} - ${childName}`;
      results.push(formattedResult);
    });

    return `${localization.datasetForm.helptext.parentTheme}: ${results.join('; ')}`;
  };

  const containsFilter = (inputValue: string, option: Option): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <FormContainer>
      <FormContainer.Header
        title={localization.datasetForm.heading.losTheme}
        subtitle={localization.datasetForm.helptext.theme}
      />
      <>
        <div className={styles.combobox}>
          <TitleWithTag
            title={localization.datasetForm.fieldLabel.losTheme}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          />

          <Field
            as={Combobox}
            name='losThemeList'
            value={values.losThemeList}
            multiple
            virtual
            filter={containsFilter}
            placeholder={`${localization.search.search}...`}
            onValueChange={(values: string[]) => setFieldValue('losThemeList', values)}
          >
            <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
            {losThemes?.map((theme) => (
              <Combobox.Option
                key={theme.uri}
                value={theme.uri}
                description={getParentNames(theme.losPaths)}
              >
                {getTranslateText(theme.name)}
              </Combobox.Option>
            ))}
          </Field>
        </div>
      </>
      <FormContainer.Header
        title={localization.datasetForm.heading.euTheme}
        subtitle={localization.datasetForm.helptext.theme}
      />
      <>
        <div className={styles.combobox}>
          <TitleWithTag
            title={localization.datasetForm.fieldLabel.euTheme}
            tagTitle={localization.tag.required}
          />

          <Field
            as={Combobox}
            multiple
            filter={containsFilter}
            placeholder={`${localization.search.search}...`}
            error={errors.euThemeList}
            value={values.euThemeList}
            onValueChange={(values: string[]) => setFieldValue('euThemeList', values)}
          >
            <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
            {dataThemes &&
              dataThemes.map((eutheme) => (
                <Combobox.Option
                  key={eutheme.uri}
                  value={eutheme.uri}
                >
                  {getTranslateText(eutheme.label)}
                </Combobox.Option>
              ))}
          </Field>
        </div>
      </>
    </FormContainer>
  );
};

export default ThemeSection;
