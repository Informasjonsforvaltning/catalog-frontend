'use client';
import { AddButton, FormikSearchCombobox, TitleWithTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Checkbox, Label, Textfield } from '@digdir/designsystemet-react';
import { useCallback, useState } from 'react';
import {
  useSearchAdministrativeUnits,
  useSearchAdministrativeUnitsByUri,
} from '../../../../hooks/useReferenceDataSearch';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { debounce, sortBy } from 'lodash';
import FieldsetWithDelete from '../../../fieldset-with-delete';

interface Props {
  referenceDataEnv: string;
  languages: ReferenceDataCode[];
}

export const RecommendedDetailFields = ({ referenceDataEnv, languages }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const langNOR = languages.filter((lang) => lang.code === 'NOR')[0];

  const { data: searchHits, isLoading: isSearching } = useSearchAdministrativeUnits(searchTerm, referenceDataEnv);
  const { data: selectedValues } = useSearchAdministrativeUnitsByUri(values?.spatialList, referenceDataEnv);

  const debouncedSetSearchTerm = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const handleSearchChange = useCallback(
    (input: any) => {
      debouncedSetSearchTerm(input.target.value);
    },
    [searchTerm],
  );

  const customLanguageOrder = [
    'http://publications.europa.eu/resource/authority/language/NOB',
    'http://publications.europa.eu/resource/authority/language/NNO',
    'http://publications.europa.eu/resource/authority/language/ENG',
    'http://publications.europa.eu/resource/authority/language/SMI',
  ];

  const sortedLanguages = sortBy(languages, (item) => {
    return customLanguageOrder.indexOf(item.uri);
  });

  return (
    <>
      <Checkbox.Group
        onChange={(values) => setFieldValue('languageList', values)}
        value={values.languageList}
        legend={
          <TitleWithTag
            title={localization.datasetForm.heading.language}
            tagColor='info'
            tagTitle={localization.tag.recommended}
          />
        }
        size='sm'
      >
        {values.languageList && values.languageList.includes('NOR') && (
          <Checkbox
            key={langNOR.uri}
            value={langNOR.uri}
          >
            {getTranslateText(langNOR.label)}
          </Checkbox>
        )}
        {sortedLanguages
          .filter((lang) => lang.code !== 'NOR')
          .map((lang) => (
            <Checkbox
              key={lang.uri}
              value={lang.uri}
            >
              {getTranslateText(lang.label)}
            </Checkbox>
          ))}
      </Checkbox.Group>
      <div>
        <TitleWithTag
          title={localization.datasetForm.heading.spatial}
          tagColor='info'
          tagTitle={localization.tag.recommended}
        />
        <FormikSearchCombobox
          selectedValuesSearchHits={selectedValues ?? []}
          querySearchHits={searchHits ?? []}
          formikValues={values.spatialList ?? []}
          onChange={handleSearchChange}
          onValueChange={(selectedValues) => setFieldValue('spatialList', selectedValues)}
          value={values.spatialList || []}
          virtual
          loading={isSearching}
        />
      </div>
      <FieldArray
        name='temporal'
        render={({ remove, push }) => (
          <div>
            <Label> {localization.datasetForm.heading.temporal}</Label>
            {values.temporal &&
              values.temporal.map((_, index) => (
                <FieldsetWithDelete
                  onDelete={() => remove(index)}
                  key={`fieldset-${index}`}
                >
                  <Field
                    as={Textfield}
                    size='sm'
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
                    size='sm'
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
                </FieldsetWithDelete>
              ))}

            <AddButton onClick={() => push({ startDate: '', endDate: '' })}>
              {localization.datasetForm.button.addDate}
            </AddButton>
          </div>
        )}
      />
    </>
  );
};
