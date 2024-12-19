import { AccessRights, Dataset } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Card, Combobox } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { AccessRightsUriTable } from './access-rights-uri-table';
import styles from '../../dataset-form.module.css';

const accessRightsOptions = [
  { value: AccessRights.PUBLIC, label: localization.datasetForm.accessRight.public },
  { value: AccessRights.RESTRICTED, label: localization.datasetForm.accessRight.restricted },
  { value: AccessRights.NON_PUBLIC, label: localization.datasetForm.accessRight.nonPublic },
];

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  return (
    <Card className={styles.card}>
      <div className={styles.fieldContainer}>
        <TitleWithTag
          title={localization.access}
          tagColor='info'
          tagTitle={localization.tag.recommended}
        />
        <Combobox
          size='sm'
          value={[values.accessRights?.uri || AccessRights.PUBLIC]}
          onValueChange={(values) => setFieldValue('accessRights.uri', values.toString())}
        >
          {accessRightsOptions.map((option) => (
            <Combobox.Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </Combobox.Option>
          ))}
        </Combobox>
      </div>

      {(values.accessRights?.uri === AccessRights.RESTRICTED ||
        values.accessRights?.uri === AccessRights.NON_PUBLIC) && <AccessRightsUriTable />}
    </Card>
  );
};
