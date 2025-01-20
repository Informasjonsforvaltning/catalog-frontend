'use client';
import { Dataset } from '@catalog-frontend/types';
import { LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
import {
  useSearchInformationModelsByUri,
  useSearchInformationModelsSuggestions,
} from '../../../hooks/useSearchService';
import { useFormikContext } from 'formik';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import styles from '../dataset-form.module.css';
import { UriWithLabelFieldsetTable } from './uri-with-label-field-set-table';

interface Props {
  searchEnv: string;
}

export const InformationModelSection = ({ searchEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();
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
    <>
      {!isLoading && (
        <Fieldset
          legend={
            <LabelWithHelpTextAndTag
              helpAriaLabel={localization.datasetForm.fieldLabel.informationModelsFromFDK}
              helpText={localization.datasetForm.helptext.informationModelsFromFDK}
              fieldId={'informationModelsFromFDK-combobox'}
            >
              {localization.datasetForm.fieldLabel.informationModelsFromFDK}
            </LabelWithHelpTextAndTag>
          }
        >
          <Combobox
            id='informationModelsFromFDK-combobox'
            size='sm'
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
        </Fieldset>
      )}

      <UriWithLabelFieldsetTable
        values={values.informationModel}
        fieldName={'informationModel'}
        label={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.datasetForm.fieldLabel.informationModel}
            helpText={localization.datasetForm.helptext.informationModel}
          >
            {localization.datasetForm.fieldLabel.informationModel}
          </LabelWithHelpTextAndTag>
        }
      />
    </>
  );
};
