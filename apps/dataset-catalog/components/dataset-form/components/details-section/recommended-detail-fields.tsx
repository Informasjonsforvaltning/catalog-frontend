'use client';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset } from '@digdir/designsystemet-react';
import { CheckboxGroup } from '@fellesdatakatalog/ui';
import { useCallback, useState } from 'react';
import {
  useSearchAdministrativeUnits,
  useSearchAdministrativeUnitsByUri,
} from '../../../../hooks/useReferenceDataSearch';
import { useFormikContext } from 'formik';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import { debounce, sortBy } from 'lodash';
import styles from '../../dataset-form.module.css';
import { TemporalModal } from './temporal-modal';

interface Props {
  referenceDataEnv: string;
  languages: ReferenceDataCode[];
}

export const RecommendedDetailFields = ({ referenceDataEnv, languages }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const langNOR = languages.filter((lang) => lang.code === 'NOR')[0];

  const { data: searchHits, isLoading: isSearching } = useSearchAdministrativeUnits(searchTerm, referenceDataEnv);
  const { data: selectedValues } = useSearchAdministrativeUnitsByUri(values?.spatial, referenceDataEnv);

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

  const getDescription = (item: ReferenceDataCode | undefined) =>
    item ? (item.uri.includes('geonorge') ? getLocationType(item.uri) : item.code) : '';

  const getLocationType = (uri: string): string => {
    if (uri.includes('kommune')) return localization.spatial.municipality;
    if (uri.includes('fylke')) return localization.spatial.county;
    if (uri.includes('nasjon')) return localization.spatial.country;
    return '';
  };

  const comboboxOptions: ReferenceDataCode[] = [
    // Combine selectedValues, searchHits, and values (mapped with uri-only fallback)
    ...new Map(
      [
        ...(selectedValues ?? []),
        ...(searchHits ?? []),
        ...(values.spatial ?? []).map((uri) => {
          const foundItem =
            selectedValues?.find((item) => item.uri === uri) || searchHits?.find((item) => item.uri === uri);
          return {
            uri,
            label: foundItem?.label ?? undefined,
            code: getDescription(foundItem),
          };
        }),
      ].map((item) => [item.uri, item]),
    ).values(),
  ];

  const languageOptions = [
    ...(values.language && values.language.some((lang) => lang.includes('NOR')) ? [{ value: langNOR.uri, label: getTranslateText(langNOR.label) || '' }] : []),
    ...sortedLanguages
      .filter((lang) => lang.code !== 'NOR')
      .map((lang) => ({
        value: lang.uri,
        label: getTranslateText(lang.label) || '',
      })),
  ];

  return (
    <>
      <CheckboxGroup
        onChange={(values) => setFieldValue('language', values)}
        value={values.language ?? []}
        legend={
          <TitleWithHelpTextAndTag
            tagColor='info'
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.language}
          >
            {localization.datasetForm.fieldLabel.language}
          </TitleWithHelpTextAndTag>
        }
        data-size='sm'
        options={languageOptions}
      />

      <FieldsetDivider />

      <div className={styles.fieldContainer}>
        <Fieldset data-size='sm'>
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              tagColor='info'
              tagTitle={localization.tag.recommended}
              helpText={localization.datasetForm.helptext.spatial}
            >
              {localization.datasetForm.fieldLabel.spatial}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <Combobox
            placeholder={`${localization.search.search}...`}
            multiple
            hideClearButton
            filter={() => true} // disable filter
            data-size='sm'
            onChange={handleSearchChange}
            onValueChange={(selectedValues) => setFieldValue('spatial', selectedValues)}
            value={values.spatial || []}
            virtual
            loading={isSearching}
          >
            <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
            {comboboxOptions.map((item) => (
              <Combobox.Option
                key={item.uri}
                value={item.uri}
                description={getDescription(item)}
              >
                {item.label ? getTranslateText(item.label) : item.uri}
              </Combobox.Option>
            ))}
          </Combobox>
        </Fieldset>
      </div>
      <FieldsetDivider />
      <TemporalModal
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            helpText={localization.datasetForm.helptext.temporal}
          >
            {localization.datasetForm.fieldLabel.temporal}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
    </>
  );
};
