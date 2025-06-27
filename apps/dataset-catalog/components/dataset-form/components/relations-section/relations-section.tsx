import { Dataset, StorageData } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization, DataStorage } from '@catalog-frontend/utils';
import { Box } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';
import { ReferenceTable } from './references-table';
import styles from '../../dataset-form.module.css';

type Props = {
  searchEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

export const RelationsSection = ({ searchEnv, autoSaveId, autoSaveStorage }: Props) => {
  const { errors } = useFormikContext<Dataset>();

  return (
    <Box>
      <ReferenceTable searchEnv={searchEnv} autoSaveId={autoSaveId} autoSaveStorage={autoSaveStorage} />
      <FieldsetDivider />
      <div className={styles.fieldContainer}>
        <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.relations}>
          {localization.datasetForm.fieldLabel.relations}
        </TitleWithHelpTextAndTag>
        <UriWithLabelFieldsetTable
          fieldName={'relations'}
          errors={errors.relations}
        />
      </div>
    </Box>
  );
};
