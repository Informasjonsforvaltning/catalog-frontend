import { Dataset, DatasetSeries } from '@catalog-frontend/types';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Label, Divider } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';
import { ReferenceTable } from './references-table';

type Props = {
  searchEnv: string;
  datasetSeries: DatasetSeries[];
};

export const RelationsSection = ({ searchEnv, datasetSeries }: Props) => {
  const { setFieldValue, values } = useFormikContext<Dataset>();

  return (
    <>
      <ReferenceTable searchEnv={searchEnv} />
      <FieldsetDivider />
      {datasetSeries && (
        <Combobox
          label={localization.datasetForm.fieldLabel.datasetSeries}
          onValueChange={(value) => setFieldValue('inSeries', value.toString())}
          value={values.inSeries ? [values.inSeries] : []}
          initialValue={values?.inSeries ? [values?.inSeries] : []}
          placeholder={`${localization.search.search}...`}
          size='sm'
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
      <div>
        <Divider />
      </div>
      <div>
        <Label>{localization.datasetForm.heading.relatedResources}</Label>
        <UriWithLabelFieldsetTable
          values={values.relations}
          fieldName={'relations'}
        />
      </div>
    </>
  );
};
