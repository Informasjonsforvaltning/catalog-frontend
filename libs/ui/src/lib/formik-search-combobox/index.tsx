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

  return (
    <Combobox
      {...rest}
      placeholder={`${localization.search.search}...`}
      virtual={virtual}
      multiple
      filter={() => true} // disable filter
    >
      <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
      {comboboxOptions.map((type) => (
        <Combobox.Option
          key={type.uri}
          value={type.uri}
          description={virtual ? type.code : ''}
        >
          {type.label ? getTranslateText(type.label) : type.uri}
        </Combobox.Option>
      ))}
    </Combobox>
  );
}

export default FormikSearchCombobox;
