import { Dataset, DatasetSeries } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Combobox } from '@digdir/designsystemet-react';
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
    <Box>
      <ReferenceTable searchEnv={searchEnv} />
      <FieldsetDivider />
      <div className={styles.fieldContainer}>
        <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.inSeries}>
          {localization.datasetForm.fieldLabel.inSeries}
        </TitleWithHelpTextAndTag>

        {datasetSeries && (
          <Combobox
            onValueChange={(value) => setFieldValue('inSeries', value.toString())}
            value={values.inSeries ? [values.inSeries] : []}
            initialValue={values?.inSeries ? [values?.inSeries] : []}
            placeholder={`${localization.search.search}...`}
            size='sm'
            virtual
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
        <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.relations}>
          {localization.datasetForm.fieldLabel.relations}
        </TitleWithHelpTextAndTag>
        <UriWithLabelFieldsetTable
          values={values.relations}
          fieldName={'relations'}
        />
      </div>
    </Box>
  );
};
