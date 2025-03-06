import { Dataset } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Radio } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { AccessRightsUriTable } from './access-rights-uri-table';

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  return (
    <Box>
      <div>
        <Radio.Group
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
          value={values?.accessRights?.uri || 'none'}
          onChange={(values) => setFieldValue('accessRights.uri', values.toString())}
        >
          <Radio value='none'>{`${localization.accessRight.none}`}</Radio>
          {accessRights.map((option, index) => (
            <Radio
              key={`${option.uri}-${index}`}
              value={option.uri}
            >
              {getTranslateText(option.label)}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <FieldsetDivider />
      <AccessRightsUriTable />
    </Box>
  );
};
