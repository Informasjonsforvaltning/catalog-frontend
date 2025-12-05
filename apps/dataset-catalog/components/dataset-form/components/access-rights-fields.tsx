import { Dataset } from '@catalog-frontend/types';
import { FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { accessRights, getTranslateText, localization } from '@catalog-frontend/utils';
import { RadioGroup } from '@fellesdatakatalog/ui';
import { Card } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from './uri-with-label-field-set-table';

export const AccessRightFields = () => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();

  const radioOptions = [
    { value: 'none', label: localization.accessRight.none },
    ...(accessRights?.map((option) => ({
      value: option.uri,
      label: getTranslateText(option.label) || '',
    })) || []),
  ];

  return (
    <>
      <RadioGroup
        data-size='sm'
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.accessRights}
            tagColor='info'
            tagTitle={localization.tag.recommended}
          >
            {localization.access}
          </TitleWithHelpTextAndTag>
        }
        value={values?.accessRight || 'none'}
        onChange={(value: string) => setFieldValue('accessRight', value)}
        options={radioOptions}
        description={undefined}
        error={undefined}
        disabled={undefined}
        readOnly={undefined}
        required={undefined}
        name={undefined}
        className={undefined}
      />

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        fieldName={'legalBasisForRestriction'}
        errors={errors.legalBasisForRestriction}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.legalBasisForRestriction}
            tagTitle={localization.tag.recommended}
            tagColor={'info'}
          >
            {localization.datasetForm.fieldLabel.legalBasisForRestriction}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        fieldName={'legalBasisForProcessing'}
        errors={errors.legalBasisForProcessing}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.legalBasisForProcessing}
            tagTitle={localization.tag.recommended}
            tagColor={'info'}
          >
            {localization.datasetForm.fieldLabel.legalBasisForProcessing}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <UriWithLabelFieldsetTable
        fieldName={'legalBasisForAccess'}
        errors={errors.legalBasisForAccess}
        hideHeadWhenEmpty={true}
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.legalBasisForAccess}
            tagTitle={localization.tag.recommended}
            tagColor={'info'}
          >
            {localization.datasetForm.fieldLabel.legalBasisForAccess}
          </TitleWithHelpTextAndTag>
        }
      />
    </>
  );
};
