'use client';
import { Combobox } from '@digdir/designsystemet-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { ReferenceDataCode } from '@catalog-frontend/types';
import { ComboboxProps } from '@digdir/designsystemet-react/dist/types/components/form/Combobox/Combobox';

interface Props extends ComboboxProps {
  selectedValuesSearchHits: ReferenceDataCode[];
  querySearchHits: ReferenceDataCode[];
  formikValues: string[];
  showCodeAsDescription?: boolean;
}

export function FormikReferenceDataCombobox({
  formikValues,
  selectedValuesSearchHits,
  querySearchHits,
  virtual,
  showCodeAsDescription = false,
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
      placeholder={`${localization.search.search}...`}
      multiple
      hideClearButton
      filter={() => true} // disable filter
      size='sm'
      virtual
      {...rest}
    >
      <Combobox.Empty>{`${localization.search.noHits}... `}</Combobox.Empty>
      {comboboxOptions.map((item) => (
        <Combobox.Option
          key={item.uri}
          value={item.uri}
          description={showCodeAsDescription ? item?.code : ''}
        >
          {item.label ? getTranslateText(item.label) : item.uri}
        </Combobox.Option>
      ))}
    </Combobox>
  );
}

export default FormikReferenceDataCombobox;
