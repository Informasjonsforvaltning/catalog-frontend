import { useState } from 'react';
import { Dataset, DatasetSerie } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FormContainer } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Heading, Combobox, Textfield } from '@digdir/designsystemet-react';
import { Field, FieldArray, useFormikContext } from 'formik';
import relations from '../utils/relations.json';
import { useSearchDatasetsByUri, useSearchDatasetSuggestions } from '../../../hooks/useSearchService';

type TitleSectionProps = {
  searchEnv: string;
  datasetSeries: DatasetSeries[];
};

export const RelationsSection = ({ searchEnv, datasetSeries }: TitleSectionProps) => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const [searchQuery, setSearchQuery] = useState('');

  const getUriList = () => {
    return values.references?.map((reference) => reference.source.uri).filter((uri) => uri) ?? [];
  };

  const { data: searchHits, isLoading: searching } = useSearchDatasetSuggestions(searchEnv, searchQuery);
  const { data: selectedValues, isLoading } = useSearchDatasetsByUri(searchEnv, getUriList());

  const comboboxOptions = [
    ...new Map(
      [
        ...(searchHits ?? []),
        ...(selectedValues ?? []),
        ...(getUriList() ?? []).map((uri) => {
          const foundItem =
            searchHits?.find((item) => item.uri === uri) || selectedValues?.find((item) => item.uri === uri);

          return {
            uri,
            title: foundItem?.title ?? null,
          };
        }),
      ].map((option) => [option.uri, option]),
    ).values(),
  ];

  return (
    <div>
      <Heading
        size='sm'
        spacing
      >
        {localization.datasetForm.heading.relations}
      </Heading>
      <FormContainer>
        <FormContainer.Header
          title={localization.datasetForm.heading.relationsDataset}
          subtitle={localization.datasetForm.helptext.relationsDataset}
        />

        <FieldArray name='references'>
          {({ remove, push }) => (
            <div>
              {values.references?.map((_, index) => (
                <div key={index}>
                  <Combobox
                    label={localization.datasetForm.fieldLabel.relationType}
                    onValueChange={(value) =>
                      setFieldValue(`references[${index}].referenceType.code`, value.toString())
                    }
                    value={
                      values.references?.[index]?.referenceType?.code
                        ? [values.references?.[index]?.referenceType?.code]
                        : []
                    }
                    placeholder={`${localization.datasetForm.fieldLabel.choseRelation}...`}
                  >
                    <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
                    {relations.map((relation) => (
                      <Combobox.Option
                        key={relation?.code}
                        value={relation?.code}
                        description={`${relation?.uriAsPrefix} (${relation?.uri})`}
                      >
                        {getTranslateText(relation?.label)}
                      </Combobox.Option>
                    ))}
                  </Combobox>

                  {!isLoading && (
                    <Combobox
                      label={localization.datasetForm.fieldLabel.dataset}
                      onChange={(input: any) => setSearchQuery(input.target.value)}
                      onValueChange={(value) => {
                        setFieldValue(`references.${[index]}.source.uri`, value.toString());
                      }}
                      loading={searching}
                      value={values.references?.[index]?.source?.uri ? [values.references?.[index]?.source?.uri] : []}
                      placeholder={`${localization.search.search}...`}
                    >
                      <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
                      {comboboxOptions?.map((dataset) => (
                        <Combobox.Option
                          key={dataset.uri}
                          value={dataset.uri}
                        >
                          {dataset?.title ? getTranslateText(dataset?.title) : dataset.uri}
                        </Combobox.Option>
                      ))}
                    </Combobox>
                  )}
                  <DeleteButton onClick={() => remove(index)}></DeleteButton>
                </div>
              ))}

              <AddButton onClick={() => push({ type: { code: '' }, source: { uri: '' } })}></AddButton>
            </div>
          )}
        </FieldArray>
        <FormContainer.Header
          title={localization.datasetForm.heading.relationDatasetSeries}
          subtitle={localization.datasetForm.helptext.relationDatasetSeries}
        />
        {datasetSeries && (
          <Combobox
            label={localization.datasetForm.fieldLabel.datasetSeries}
            onValueChange={(value) => setFieldValue('inSeries', value.toString())}
            value={values.inSeries ? [values.inSeries] : []}
            initialValue={values?.inSeries ? [values?.inSeries] : []}
            placeholder={`${localization.search.search}...`}
          >
            <Combobox.Empty>{localization.search.noHits}</Combobox.Empty>
            {datasetSeries.map((dataset) => (
              <Combobox.Option
                value={dataset.id}
                key={dataset.id}
              >
                {getTranslateText(dataset.title)}
              </Combobox.Option>
            ))}
          </Combobox>
        )}

        <FormContainer.Header
          title={localization.datasetForm.heading.relatedResources}
          subtitle={localization.datasetForm.helptext.relatedResources}
        />
        <FieldArray name='relations'>
          {({ push, remove }) => (
            <div>
              {values.relations?.map((_, index) => (
                <div key={index}>
                  <Field
                    as={Textfield}
                    label={localization.title}
                    name={`relations[${index}].prefLabel.nb`}
                  />
                  <Field
                    as={Textfield}
                    label={localization.link}
                    name={`relations[${index}].uri`}
                    // @ts-expect-error uri exsists in object relations
                    error={errors?.relations?.[index].uri}
                  />

                  <DeleteButton onClick={() => remove(index)}></DeleteButton>
                </div>
              ))}

              <AddButton
                onClick={() =>
                  push({
                    prefLabel: { nb: '' },
                    uri: '',
                  })
                }
              ></AddButton>
            </div>
          )}
        </FieldArray>
      </FormContainer>
    </div>
  );
};
