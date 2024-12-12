'use client';
import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { ReferenceDataCode } from '@catalog-frontend/types';
import { ComboboxProps } from '@digdir/designsystemet-react/dist/types/components/form/Combobox/Combobox';

interface Props extends ComboboxProps {
  selectedValuesSearchHits: ReferenceDataCode[];
  querySearchHits: ReferenceDataCode[];
  formikValues: string[];
  virtual?: boolean;
}

export function FormikSearchCombobox({
  formikValues,
  selectedValuesSearchHits,
  querySearchHits,
  virtual,
  ...rest
}: Props) {
  const comboboxOptions: ReferenceDataCode[] = [
    // Combine selectedValues, searchHits, and values (mapped with uri-only fallback)
    ...new Map(
      [
        ...(selectedValuesSearchHits ?? []),
        ...(querySearchHits ?? []),
        ...(formikValues ?? []).map((uri) => {
          const foundItem =
            selectedValuesSearchHits?.find((item) => item.uri === uri) ||
            querySearchHits?.find((item) => item.uri === uri);
          return {
            uri,
            label: foundItem?.label ?? undefined,
            code: foundItem?.code ?? undefined,
          };
        }),
      ].map((item) => [item.uri, item]),
    ).values(),
  ];

  const getDescription = (item: ReferenceDataCode) =>
    item.uri.includes('geonorge') ? getLocationType(item.uri) : item.code;

  const getLocationType = (uri: string): string => {
    if (uri.includes('kommune')) return localization.spatial.municipality;
    if (uri.includes('fylke')) return localization.spatial.county;
    if (uri.includes('nasjon')) return localization.spatial.country;
    return '';
  };

  return (
    <Combobox
      {...rest}
      placeholder={`${localization.search.search}...`}
      multiple
      filter={() => true} // disable filter
      size='sm'
    >
      <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
      {comboboxOptions.map((item) => (
        <Combobox.Option
          key={item.uri}
          value={item.uri}
          description={virtual ? getDescription(item) : ''}
        >
          {item.label ? getTranslateText(item.label) : item.uri}
        </Combobox.Option>
      ))}
    </Combobox>
  );
}

export default FormikSearchCombobox;
