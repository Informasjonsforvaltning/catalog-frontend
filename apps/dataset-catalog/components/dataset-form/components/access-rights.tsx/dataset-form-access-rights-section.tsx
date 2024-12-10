import { AccessRights, Dataset } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { NativeSelect } from '@digdir/designsystemet-react';
import { Field, FormikHelpers, useFormikContext } from 'formik';
import { AccessRightsUriTable } from './access-rights-uri-table';

export const AccessRightsForm = () => {
  const { values } = useFormikContext<Dataset>();
  return (
    <>
      <Field name='accessRights.uri'>
        {({ field, form }: { field: any; form: FormikHelpers<Dataset> }) => (
          <NativeSelect
            {...field}
            label={
              <TitleWithTag
                title={localization.access}
                tagColor='info'
                tagTitle={localization.tag.recommended}
              />
            }
          >
            <option value={''}>{`${localization.choose}...`}</option>
            <option value={AccessRights.PUBLIC}>{localization.datasetForm.accessRight.public}</option>
            <option value={AccessRights.RESTRICTED}>{localization.datasetForm.accessRight.restricted}</option>
            <option value={AccessRights.NON_PUBLIC}>{localization.datasetForm.accessRight.nonPublic}</option>
          </NativeSelect>
        )}
      </Field>

      {(values.accessRights?.uri === AccessRights.RESTRICTED ||
        values.accessRights?.uri === AccessRights.NON_PUBLIC) && <AccessRightsUriTable />}
    </>
  );
};
