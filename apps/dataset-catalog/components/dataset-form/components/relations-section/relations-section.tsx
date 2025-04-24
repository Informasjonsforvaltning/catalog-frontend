import { Dataset } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';
import { ReferenceTable } from './references-table';
import styles from '../../dataset-form.module.css';

type Props = {
  searchEnv: string;
};

export const RelationsSection = ({ searchEnv }: Props) => {
  const { values } = useFormikContext<Dataset>();

  return (
    <Box>
      <ReferenceTable searchEnv={searchEnv} />
      <FieldsetDivider />
      <div className={styles.fieldContainer}>
        <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.relations}>
          {localization.datasetForm.fieldLabel.relations}
        </TitleWithHelpTextAndTag>
        <UriWithLabelFieldsetTable
          values={values.relatedResources}
          fieldName={'relatedResources'}
        />
      </div>
    </Box>
  );
};
