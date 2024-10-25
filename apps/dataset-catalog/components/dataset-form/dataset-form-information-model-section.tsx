'use client';
import { Dataset } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox, Textfield } from '@digdir/designsystemet-react';
import { useSearchInformationModelsByUri, useSearchInformationModelsSuggestions } from '../../hooks/useSearchService';
import { Field, FieldArray, useFormikContext } from 'formik';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import styles from './dataset-form.module.css';

interface Props {
  searchEnv: string;
}

export const InformationModelSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [searchTerm, setSearchTerm] = useState<string>('te');

  const { data: informationModelSuggestions, isLoading: searching } = useSearchInformationModelsSuggestions(
    searchEnv,
    searchTerm,
  );
  const { data: selectedInformationModels, isLoading } = useSearchInformationModelsByUri(
    searchEnv,
    values.informationModelList ?? [],
  );

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    [],
  );

  console.log('myd', selectedInformationModels);

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
        <Combobox
          onValueChange={(selectedValues: string[]) => setFieldValue('informationModelList', selectedValues)}
          onChange={(input: any) => debouncedSearch(input.target.value)}
          loading={isLoading}
          multiple
          //value={values.informationModelList}
          placeholder={`${localization.search.search}...`}
          filter={() => true} // Deactivate filter, handled by backend
        >
          <Combobox.Empty>{`${localization.search.noHits}...`}</Combobox.Empty>
          {informationModelSuggestions &&
            informationModelSuggestions.map((suggestion) => (
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

        <FormContainer.Header
          title={localization.datasetForm.heading.informationModelOther}
          subtitle={localization.datasetForm.helptext.informationModelOther}
        />
        <FieldArray
          name='informationModelList'
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
      </FormContainer>
    </div>
  );
};
