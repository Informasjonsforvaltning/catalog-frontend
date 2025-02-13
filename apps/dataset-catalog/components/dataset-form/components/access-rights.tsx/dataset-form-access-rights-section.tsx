import { AccessRights, Dataset } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Card, Combobox, Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { AccessRightsUriTable } from './access-rights-uri-table';
import styles from '../../dataset-form.module.css';

const accessRightsOptions = [
  { value: '', label: localization.accessRight.none },
  { value: AccessRights.PUBLIC, label: localization.accessRight.public },
  { value: AccessRights.RESTRICTED, label: localization.accessRight.restricted },
  { value: AccessRights.NON_PUBLIC, label: localization.accessRight.nonPublic },
];

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  return (
    <Card className={styles.card}>
      <div>
        <Fieldset
          legend={
            <TitleWithHelpTextAndTag
              helpAriaLabel={localization.access}
              helpText={localization.datasetForm.helptext.accessRights}
              tagColor='info'
              tagTitle={localization.tag.recommended}
              fieldId='accessRights.uri-combobox'
            >
              {localization.access}
            </TitleWithHelpTextAndTag>
          }
        >
          <Combobox
            id='accessRights.uri-combobox'
            size='sm'
            value={[values?.accessRights?.uri || '']}
            onValueChange={(values) => setFieldValue('accessRights.uri', values.toString())}
            virtual
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
        </Fieldset>
      </div>

      {(values.accessRights?.uri === AccessRights.RESTRICTED ||
        values.accessRights?.uri === AccessRights.NON_PUBLIC) && <AccessRightsUriTable />}
    </Card>
  );
};
