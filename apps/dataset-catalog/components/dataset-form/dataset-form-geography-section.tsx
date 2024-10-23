'use client';
import { AddButton, DeleteButton, FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Heading, Textfield } from '@digdir/designsystemet-react';
import { useCallback, useState } from 'react';
import { useSearchAdministrativeUnits, useSearchAdministrativeUnitsByUri } from '../../hooks/useReferenceDataSearch';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Dataset } from '@catalog-frontend/types';
import { debounce } from 'lodash';
import styles from './dataset-form.module.css';

interface Props {
  envVariable: string;
}

export const GeographySection = ({ envVariable }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { values, setFieldValue } = useFormikContext<Dataset>();

  const { data: searchHits, isLoading: isSearching } = useSearchAdministrativeUnits(searchTerm, envVariable);
  const { data: selectedValues, isLoading: isLoadingselectedValues } = useSearchAdministrativeUnitsByUri(
    values?.spatialList,
    envVariable,
  );

  const debouncedSetSearchTerm = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = useCallback((input: any) => {
    debouncedSetSearchTerm(input.target.value);
  }, []);

  const getLocationType = (uri: string): string => {
    if (uri.includes('kommune')) return localization.spatial.municipality;
    if (uri.includes('fylke')) return localization.spatial.country;
    if (uri.includes('nasjon')) return localization.spatial.country;
    return '';
  };

  const comboboxOptions = [
    // Combines selectedValues and searchHits, and add uri's for values not found in selectedValues
    ...new Map(
      [
        ...(selectedValues ?? []),
        ...(searchHits ?? []),
        ...(values.spatialList ?? []).map((uri) => ({
          uri,
          label:
            (selectedValues?.find((item) => item.uri === uri) || searchHits?.find((item) => item.uri === uri))?.label ??
            null,
        })),
      ].map((spatial) => [spatial.uri, spatial]),
    ).values(),
  ];

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.geography}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.datasetForm.heading.spatial}
          subtitle={localization.datasetForm.helptext.spatial}
        />
        {!isLoadingselectedValues && (
          <Combobox
            loading={isSearching || isLoadingselectedValues}
            onChange={handleSearchChange}
            placeholder={`${localization.search.search}...`}
            virtual
            multiple
            onValueChange={(selectedValues) => setFieldValue('spatialList', selectedValues)}
            value={values.spatialList || []}
            filter={() => true} // Deactivates filter. Filtering is handled in the backend.
          >
            <Combobox.Empty>
              {searchTerm.length < 2
                ? localization.datasetForm.validation.searchString
                : `${localization.search.noHits}...`}
            </Combobox.Empty>
            {comboboxOptions.map((location) => (
              <Combobox.Option
                value={location.uri}
                key={location.uri}
                description={getLocationType(location.uri)}
              >
                {location.label ? getTranslateText(location.label) : location.uri}
              </Combobox.Option>
            ))}
          </Combobox>
        )}
        <FormContainer.Header
          title={localization.datasetForm.heading.temporal}
          subtitle={localization.datasetForm.helptext.temporal}
        />
        <FieldArray
          name='temporal'
          render={({ remove, push }) => (
            <div>
              {values.temporal &&
                values.temporal.map((_, index) => (
                  <div
                    className={styles.date}
                    key={index}
                  >
                    <Field
                      as={Textfield}
                      label={
                        <TitleWithTag
                          title={localization.from}
                          tagColor='info'
                          tagTitle={localization.tag.recommended}
                        />
                      }
                      type='date'
                      name={`temporal.${index}.startDate`}
                    />
                    <Field
                      as={Textfield}
                      label={
                        <TitleWithTag
                          title={localization.to}
                          tagColor='info'
                          tagTitle={localization.tag.recommended}
                        />
                      }
                      type='date'
                      name={`temporal.${index}.endDate`}
                    />
                    <DeleteButton onClick={() => remove(index)} />
                  </div>
                ))}
              <div className={styles.fitContent}>
                <AddButton onClick={() => push({ startDate: '', endDate: '' })}>
                  {localization.datasetForm.button.addDate}
                </AddButton>
              </div>
            </div>
          )}
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.releaseDate}
          subtitle={localization.datasetForm.helptext.releaseDate}
        />
        <FormContainer.Header
          title={localization.datasetForm.heading.language}
          subtitle={localization.datasetForm.helptext.language}
        />
      </FormContainer>
    </div>
  );
};
