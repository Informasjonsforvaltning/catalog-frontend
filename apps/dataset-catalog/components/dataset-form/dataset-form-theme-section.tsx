import { Dataset, DataTheme, LosTheme, Option } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';

import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Field, useFormikContext } from 'formik';
import styles from './dataset-form.module.css';

type Props = {
  losThemes: LosTheme[];
  dataThemes: DataTheme[];
};

export const ThemeSection = ({ losThemes, dataThemes }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();

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
    <>
      <div className={styles.combobox}>
        <Field
          as={Combobox}
          hideClearButton
          value={values.losTheme}
          label={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.recommended}
              tagColor='info'
            >
              {localization.datasetForm.fieldLabel.losTheme}
            </TitleWithHelpTextAndTag>
          }
          multiple
          virtual
          filter={containsFilter}
          placeholder={`${localization.search.search}...`}
          onValueChange={(values: string[]) => setFieldValue('losTheme', values)}
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

      <div className={styles.combobox}>
        <Field
          as={Combobox}
          multiple
          hideClearButton
          label={
            <TitleWithHelpTextAndTag tagTitle={localization.tag.required}>
              {localization.datasetForm.fieldLabel.euTheme}
            </TitleWithHelpTextAndTag>
          }
          filter={containsFilter}
          placeholder={`${localization.search.search}...`}
          value={values.euDataTheme}
          onValueChange={(values: string[]) => setFieldValue('euDataTheme', values)}
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
  );
};

export default ThemeSection;
