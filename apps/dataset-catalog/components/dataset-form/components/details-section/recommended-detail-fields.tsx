'use client';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Checkbox, Combobox } from '@digdir/designsystemet-react';
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
        ...(values.spatialList ?? []).map((uri) => {
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

  return (
    <>
      <Checkbox.Group
        onChange={(values) => setFieldValue('languageList', values)}
        value={values.languageList}
        legend={
          <TitleWithHelpTextAndTag
            tagColor='info'
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.language}
          >
            {localization.datasetForm.fieldLabel.language}
          </TitleWithHelpTextAndTag>
        }
        size='sm'
      >
        {values.languageList && values.languageList.some(lang => lang.includes('NOR')) && (
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

      <FieldsetDivider />

      <div className={styles.fieldContainer}>
        <TitleWithHelpTextAndTag
          tagColor='info'
          tagTitle={localization.tag.recommended}
          helpText={localization.datasetForm.helptext.spatial}
        >
          {localization.datasetForm.fieldLabel.spatial}
        </TitleWithHelpTextAndTag>

        <Combobox
          placeholder={`${localization.search.search}...`}
          multiple
          hideClearButton
          filter={() => true} // disable filter
          size='sm'
          onChange={handleSearchChange}
          onValueChange={(selectedValues) => setFieldValue('spatialList', selectedValues)}
          value={values.spatialList || []}
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
      </div>
      <FieldsetDivider />
      <TemporalModal
        values={values.temporal}
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
    </>
  );
};
