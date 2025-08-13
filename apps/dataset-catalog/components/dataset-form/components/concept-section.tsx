'use client';
import { Dataset } from '@catalog-frontend/types';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import styles from '../dataset-form.module.css';
import { useSearchConceptsByUri, useSearchConceptSuggestions } from '../../../hooks/useSearchService';
import { FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';

interface Props {
  searchEnv: string; // Environment variable to search service
}

export const ConceptSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: searchHits, isLoading: searching } = useSearchConceptSuggestions(searchEnv, searchQuery);
  const { data: selectedConcepts } = useSearchConceptsByUri(searchEnv, values.conceptList ?? []);

  const comboboxOptions = [
    // Safely handle the default values
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

  return (
    <>
      <Fieldset
        size='sm'
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            helpText={localization.datasetForm.helptext.concept}
          >
            {localization.datasetForm.fieldLabel.concept}
          </TitleWithHelpTextAndTag>
        }
      >
        <Combobox
          size='sm'
          onValueChange={(selectedValues: string[]) => setFieldValue('conceptList', selectedValues)}
          onChange={(input: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(input.target.value)}
          loading={searching}
          multiple
          value={values.conceptList}
          placeholder={localization.search.search}
          filter={() => true} // Deactivate filter, handled by backend
          virtual
          hideClearButton
        >
          <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
          {comboboxOptions.map((suggestion) => (
            <Combobox.Option
              value={suggestion.uri}
              key={suggestion.uri}
              displayValue={
                suggestion.title ? (getTranslateText(suggestion.title) as string) : suggestion.uri
              }
            >
              <div className={styles.comboboxOption}>
                <div>
                  {suggestion.title
                    ? (getTranslateText(suggestion.title) as string)
                    : suggestion.uri}
                </div>
                <div>{capitalizeFirstLetter(getTranslateText(suggestion.description) as string)}</div>
                <div>{getTranslateText(suggestion.organization?.prefLabel)}</div>
              </div>
            </Combobox.Option>
          ))}
        </Combobox>
      </Fieldset>

      <FormikLanguageFieldset
        multiple
        name={'keywordList'}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            helpText={localization.datasetForm.helptext.keyword}
          >
            {localization.datasetForm.fieldLabel.keyword}
          </TitleWithHelpTextAndTag>
        }
      />
    </>
  );
};
