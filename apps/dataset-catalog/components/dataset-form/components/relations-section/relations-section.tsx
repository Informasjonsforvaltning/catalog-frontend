import { Dataset, DatasetSeries } from '@catalog-frontend/types';
import { FieldsetDivider, LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Label, Divider } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';
import { ReferenceTable } from './references-table';
import styles from '../../dataset-form.module.css';

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
      <div className={styles.fieldContainer}>
        <LabelWithHelpTextAndTag
          helpText={''}
          helpTitle={''}
        >
          Relasjon til datasettserie
        </LabelWithHelpTextAndTag>

        {datasetSeries && (
          <Combobox
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
      </div>
      <div>
        <FieldsetDivider />
      </div>
      <div className={styles.fieldContainer}>
        <Label size='sm'>{localization.datasetForm.heading.relatedResources}</Label>
        <UriWithLabelFieldsetTable
          values={values.relations}
          fieldName={'relations'}
        />
      </div>
    </>
  );
};
