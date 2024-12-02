'use client';
import { Dataset } from '@catalog-frontend/types';
import { Heading, Textfield, Chip, Button, Combobox } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import styles from '../dataset-form.module.css';
import { useSearchConceptsByUri, useSearchConceptSuggestions } from '../../../hooks/useSearchService';
import { FormContainer, TitleWithTag } from '@catalog-frontend/ui';

interface Props {
  searchEnv: string; // Environment variable to search service
}

export const ConceptSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [inputValue, setInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: searchHits, isLoading: searching } = useSearchConceptSuggestions(searchEnv, searchQuery);
  const { data: selectedConcepts } = useSearchConceptsByUri(searchEnv, values.conceptList ?? []);

  const comboboxOptions = [
    // Combine selectedValues, searchHits, and values (mapped with uri-only fallback)
    ...new Map(
      [
        ...(selectedConcepts ?? []),
        ...(searchHits ?? []),
        ...(values.conceptList ?? []).map((uri) => {
          const foundItem =
            selectedConcepts?.find((item) => item.uri === uri) ||
            searchHits?.find((item: { uri: string }) => item.uri === uri);
          return {
            uri,
            title: foundItem?.title ?? undefined,
            description: foundItem?.description ?? undefined,
            organization: foundItem?.organization ?? undefined,
          };
        }),
      ].map((item) => [item.uri, item]),
    ).values(),
  ];

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

        <>
          <TitleWithTag
            title={localization.datasetForm.fieldLabel.concept}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          />
          <Combobox
            onValueChange={(selectedValues: string[]) => setFieldValue('conceptList', selectedValues)}
            onChange={(input: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(input.target.value)}
            loading={searching}
            multiple
            value={values.conceptList}
            placeholder={localization.datasetForm.helptext.searchConcept}
            filter={() => true} // Deactivate filter, handled by backend
          >
            <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
            {comboboxOptions.map((suggestion) => (
              <Combobox.Option
                value={suggestion.uri}
                key={suggestion.uri}
                displayValue={
                  suggestion.title
                    ? capitalizeFirstLetter(getTranslateText(suggestion.title) as string)
                    : suggestion.uri
                }
              >
                {getTranslateText(suggestion.organization?.prefLabel)}

                <div className={styles.comboboxOption}>
                  <div>{capitalizeFirstLetter(getTranslateText(suggestion.title) as string) ?? suggestion.uri}</div>
                  <div>{capitalizeFirstLetter(getTranslateText(suggestion.description) as string)}</div>
                  <div>{getTranslateText(suggestion.organization?.prefLabel)}</div>
                </div>
              </Combobox.Option>
            ))}
          </Combobox>
        </>

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
