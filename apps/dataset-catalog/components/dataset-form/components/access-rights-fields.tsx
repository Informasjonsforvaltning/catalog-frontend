import { Dataset } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Radio } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from './uri-with-label-field-set-table';

export const AccessRightFields = () => {
  const { values, setFieldValue } = useFormikContext<Dataset>();

  return (
    <>
      <Box>
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
      </Box>

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        values={values.legalBasisForRestriction}
        fieldName={'legalBasisForRestriction'}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.legalBasisForRestriction}>
            {localization.datasetForm.fieldLabel.legalBasisForRestriction}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        values={values.legalBasisForProcessing}
        fieldName={'legalBasisForProcessing'}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.legalBasisForProcessing}>
            {localization.datasetForm.fieldLabel.legalBasisForProcessing}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        values={values.legalBasisForAccess}
        fieldName={'legalBasisForAccess'}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.legalBasisForAccess}>
            {localization.datasetForm.fieldLabel.legalBasisForAccess}
          </TitleWithHelpTextAndTag>
        }
      />
    </>
  );
};
