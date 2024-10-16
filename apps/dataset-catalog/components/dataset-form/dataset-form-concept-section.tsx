'use client';
import { Dataset, Search } from '@catalog-frontend/types';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';
import { Heading, Textfield, Chip, Button, Combobox } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { searchConceptSuggestions } from '@catalog-frontend/data-access';
import styles from './dataset-form.module.css';

interface Props {
  searchEnv: string; // Environment variable to search service
}

export const ConceptSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Search.Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Search.Suggestion[]>([]);

  useEffect(() => {
    const fetchConceptsByUri = async () => {
      if (!values.conceptList?.length) return;

      setLoading(true);
      const searchOperation: Search.SearchOperation = {
        filters: { uri: { value: values.conceptList } },
      };

      try {
        const response = await fetch(`${searchEnv}/search/concepts`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(searchOperation),
        });

        if (!response.ok) {
          throw new Error(`${response.statusText}`);
        }

        const data = await response.json();
        setSelectedSuggestions(data.hits);
        setSuggestions(data.hits);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConceptsByUri();
  }, [values.conceptList, searchEnv]);

  const searchSuggestions = (input: string) => {
    if (!input) return;
    setLoading(true);
    searchConceptSuggestions(searchEnv, input)
      .then((response) => response.json())
      .then((data) => {
        const mergedSuggestions = [
          ...new Map(
            [...selectedSuggestions, ...data.suggestions].map((suggestion) => [suggestion.uri, suggestion]),
          ).values(), // remove duplicates
        ];
        setSuggestions(mergedSuggestions);
      })
      .catch((error) => {
        console.error('Error fetching concept suggestions:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addKeyword = () => {
    if (inputValue && !values.keywordList?.nb?.includes(inputValue)) {
      const updatedKeywords = [...(values.keywordList?.nb || []), inputValue];
      setFieldValue('keywordList.nb', updatedKeywords);
      setInputValue('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = values.keywordList?.nb?.filter((item: string) => item !== keyword) || [];
    setFieldValue('keywordList.nb', updatedKeywords);
  };

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.concept}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.resourceType.concept}
          subtitle={localization.datasetForm.helptext.concept}
        />

        {((values.conceptList && suggestions.length > 0) || values.conceptList?.length === 0) && (
          <>
            <TitleWithTag
              title={localization.datasetForm.fieldLabel.concept}
              tagTitle={localization.tag.recommended}
              tagColor='info'
            />
            <Combobox
              onValueChange={(selectedValues: string[]) => setFieldValue('conceptList', selectedValues)}
              onChange={(input: any) => searchSuggestions(input.target.value)}
              loading={loading}
              multiple
              value={values.conceptList}
              placeholder={localization.datasetForm.helptext.searchConcept}
            >
              {suggestions.map((suggestion) => (
                <Combobox.Option
                  value={suggestion.uri}
                  key={suggestion.id}
                  displayValue={capitalizeFirstLetter(getTranslateText(suggestion.title) as string) ?? suggestion.uri}
                >
                  <div className={styles.comboboxOption}>
                    <div>{capitalizeFirstLetter(getTranslateText(suggestion.title) as string) ?? suggestion.uri}</div>
                    <div>{capitalizeFirstLetter(getTranslateText(suggestion.description) as string)}</div>
                    <div>{getTranslateText(suggestion.organization?.prefLabel)}</div>
                  </div>
                </Combobox.Option>
              ))}
            </Combobox>
          </>
        )}

        <FormContainer.Header
          title='Emneord'
          subtitle={localization.datasetForm.helptext.keyword}
        />
        <div className={styles.bottomRow}>
          <div className={styles.fullWidth}>
            <Textfield
              label={
                <TitleWithTag
                  title={localization.datasetForm.fieldLabel.keyword.nb}
                  tagTitle={localization.tag.recommended}
                  tagColor='info'
                />
              }
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
          </div>
          <div className={styles.button}>
            <Button onClick={addKeyword}>{`${localization.add}...`}</Button>
          </div>
        </div>
        <Chip.Group>
          {values.keywordList?.nb?.map((value: string) => (
            <Chip.Removable
              key={value}
              onClick={() => removeKeyword(value)}
            >
              {value}
            </Chip.Removable>
          ))}
        </Chip.Group>
      </FormContainer>
    </div>
  );
};
