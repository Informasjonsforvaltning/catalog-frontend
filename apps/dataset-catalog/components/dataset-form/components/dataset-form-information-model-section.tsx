'use client';
import { Dataset } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox, Textfield } from '@digdir/designsystemet-react';
import {
  useSearchInformationModelsByUri,
  useSearchInformationModelsSuggestions,
} from '../../../hooks/useSearchService';
import { Field, FieldArray, useFormikContext } from 'formik';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import styles from '../dataset-form.module.css';

interface Props {
  searchEnv: string;
}

export const InformationModelSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: informationModelSuggestions, isLoading: searching } = useSearchInformationModelsSuggestions(
    searchEnv,
    searchTerm,
  );
  const { data: selectedInformationModels, isLoading } = useSearchInformationModelsByUri(
    searchEnv,
    values.informationModelsFromFDK || [],
  );

  const comboboxOptions = [
    // Combine selectedInformationModels and informationModelSuggestions, and adding uri's for values not found in selectedInformationModels
    ...new Map(
      [
        ...(selectedInformationModels ?? []),
        ...(informationModelSuggestions ?? []),
        ...(values.informationModelsFromFDK ?? []).map((uri) => {
          const foundItem =
            selectedInformationModels?.find((item) => item.uri === uri) ||
            informationModelSuggestions?.find((item) => item.uri === uri);

          return {
            uri,
            title: foundItem?.title ?? null,
            description: foundItem?.description ?? null,
            organization: foundItem?.organization ?? null,
          };
        }),
      ].map((option) => [option.uri, option]),
    ).values(),
  ];

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [],
  );

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.informationModel}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.datasetForm.heading.informationModelFDK}
          subtitle={localization.datasetForm.helptext.informationModelFDK}
        />
        {!isLoading && (
          <Combobox
            onValueChange={(selectedValues: string[]) => setFieldValue('informationModelsFromFDK', selectedValues)}
            onChange={(input: any) => debouncedSearch(input.target.value)}
            loading={searching}
            multiple
            value={values.informationModelsFromFDK}
            placeholder={`${localization.search.search}...`}
            filter={() => true} // Deactivate filter, handled by backend
          >
            <Combobox.Empty>{`${localization.search.noHits}...`}</Combobox.Empty>
            {comboboxOptions &&
              comboboxOptions.map((suggestion) => (
                <Combobox.Option
                  value={suggestion.uri}
                  key={suggestion.uri}
                  displayValue={capitalizeFirstLetter(getTranslateText(suggestion.title) as string) ?? suggestion.uri}
                >
                  <div className={styles.comboboxOption}>
                    <div>{capitalizeFirstLetter(getTranslateText(suggestion.title) as string) ?? suggestion.uri}</div>
                    <div>{capitalizeFirstLetter(getTranslateText(suggestion.description) as string) ?? ''}</div>
                    <div>{getTranslateText(suggestion.organization?.prefLabel) ?? ''}</div>
                  </div>
                </Combobox.Option>
              ))}
          </Combobox>
        )}

        <FormContainer.Header
          title={localization.datasetForm.heading.informationModelOther}
          subtitle={localization.datasetForm.helptext.informationModelOther}
        />
        <FieldArray
          name='informationModel'
          render={({ remove, push }) => (
            <div>
              {values.informationModel &&
                values.informationModel.map((_, index) => (
                  <div
                    key={index}
                    className={styles.fieldArrayRow}
                  >
                    <Field
                      as={Textfield}
                      name={`informationModel[${index}].prefLabel.nb`}
                      label={localization.datasetForm.fieldLabel.informationModelTitle}
                    />
                    <Field
                      as={Textfield}
                      name={`informationModel[${index}].uri`}
                      label={localization.datasetForm.fieldLabel.informationModelUrl}
                      // @ts-expect-error: uri exists on the object
                      error={errors.informationModel?.[index]?.uri || ''}
                    />

                    <div className={styles.buttonContainer}>
                      <DeleteButton onClick={() => remove(index)} />
                    </div>
                  </div>
                ))}
              <div className={styles.fitContent}>
                <AddButton onClick={() => push('informationModel')}>
                  {localization.datasetForm.button.addInformationModel}
                </AddButton>
              </div>
            </div>
          )}
        />
      </FormContainer>
    </div>
  );
};
