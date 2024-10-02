import { Dataset, Option } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { useThemes } from '../../app/context/themes/index';
import { Chip, Combobox, Spinner } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { FormikErrors, useFormikContext } from 'formik';
import styles from './dataset-form.module.css';

type Props = {
  errors: FormikErrors<Dataset>;
  values: Dataset;
};

export const TemaSection = ({ errors, values }: Props) => {
  const { losThemes, dataThemes, loading } = useThemes();
  const { setFieldValue, values: formikValues } = useFormikContext<Dataset>();

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

  const handleLosValueChange = (newValues: string[]) => {
    setFieldValue('losThemeList', newValues);
  };

  const handleEuValueChange = (newValues: string[]) => {
    setFieldValue('euThemeList', newValues);
  };

  const handleRemoveLosChip = (valueToRemove: string) => {
    const newValues = formikValues.losThemeList && formikValues.losThemeList.filter((value) => value !== valueToRemove);
    setFieldValue('losThemeList', newValues);
  };

  const handleRemoveEuChip = (valueToRemove: string) => {
    const newValues = formikValues.euThemeList && formikValues.euThemeList.filter((value) => value !== valueToRemove);
    setFieldValue('euThemeList', newValues);
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
          <Combobox
            multiple
            hideChips
            onValueChange={handleLosValueChange}
            virtual
            filter={containsFilter}
            placeholder={`${localization.search.search}...`}
            name='losThemeList'
            initialValue={values.losThemeList}
            loading={loading}
            loadingLabel={localization.loading}
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
          </Combobox>
        </div>
        <div className={styles.chip}>
          {loading ? (
            <div className={styles.spinner}>
              <Spinner title={localization.loading} />
            </div>
          ) : (
            <Chip.Group>
              {formikValues?.losThemeList &&
                formikValues.losThemeList.map((value) => {
                  const theme = losThemes?.find((theme) => theme.uri === value);
                  return (
                    <Chip.Removable
                      key={`chip-${value}`}
                      onClick={() => handleRemoveLosChip(value)}
                    >
                      {theme ? getTranslateText(theme.name) : ''}
                    </Chip.Removable>
                  );
                })}
            </Chip.Group>
          )}
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

          <Combobox
            multiple
            hideChips
            onValueChange={handleEuValueChange}
            filter={containsFilter}
            placeholder={`${localization.search.search}...`}
            name='euThemeList'
            initialValue={values.euThemeList}
            error={errors.euThemeList}
            loading={loading}
            loadingLabel={localization.loading}
          >
            <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
            {dataThemes?.map((eutheme) => (
              <Combobox.Option
                key={eutheme.uri}
                value={eutheme.uri}
              >
                {getTranslateText(eutheme.label)}
              </Combobox.Option>
            ))}
          </Combobox>
        </div>
        <div className={styles.chip}>
          {loading ? (
            <div className={styles.spinner}>
              <Spinner title={`${localization.loading}...`} />
            </div>
          ) : (
            <Chip.Group>
              {formikValues?.euThemeList &&
                formikValues.euThemeList.map((value) => {
                  const theme = dataThemes?.find((theme) => theme.uri === value);
                  return (
                    <Chip.Removable
                      key={`chip-${value}`}
                      onClick={() => handleRemoveEuChip(value)}
                    >
                      {theme ? getTranslateText(theme.label) : ''}
                    </Chip.Removable>
                  );
                })}
            </Chip.Group>
          )}
        </div>
      </>
    </FormContainer>
  );
};

export default TemaSection;
