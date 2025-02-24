import { Dataset } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import {
  accessRightNonPublic,
  accessRightRestricted,
  accessRights,
  getTranslateText,
  localization,
} from '@catalog-frontend/utils';
import { Card, Combobox, Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { AccessRightsUriTable } from './access-rights-uri-table';
import styles from '../../dataset-form.module.css';

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  return (
    <Card className={styles.card}>
      <div>
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.accessRights}
              tagColor='info'
              tagTitle={localization.tag.recommended}
            >
              {localization.access}
            </TitleWithHelpTextAndTag>
          }
        >
          <Combobox
            size='sm'
            value={[values?.accessRights?.uri || '']}
            onValueChange={(values) => setFieldValue('accessRights.uri', values.toString())}
            virtual
          >
            <Combobox.Option value=''>{`${localization.dataServiceForm.noLicense}`}</Combobox.Option>
            {accessRights.map((option) => (
              <Combobox.Option
                key={option.uri}
                value={option.uri}
              >
                {getTranslateText(option.label)}
              </Combobox.Option>
            ))}
          </Combobox>
        </Fieldset>
      </div>

      {(values.accessRights?.uri === accessRightRestricted.uri ||
        values.accessRights?.uri === accessRightNonPublic.uri) && <AccessRightsUriTable />}
    </Card>
  );
};
