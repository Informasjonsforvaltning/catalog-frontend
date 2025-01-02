import { FormikLanguageFieldset, LabelWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { FastField } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightFields } from './access-rights.tsx/dataset-form-access-rights-section';

export const AboutSection = () => {
  return (
    <>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        requiredLanguages={['nb']}
        legend={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpAriaLabel={localization.title}
            helpText={localization.datasetForm.helptext.title}
          >
            {localization.title}
          </LabelWithHelpTextAndTag>
        }
      />

      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        requiredLanguages={['nb']}
        legend={
          <LabelWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.description}
            helpAriaLabel={localization.description}
            tagTitle={localization.tag.required}
          >
            {localization.description}
          </LabelWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <AccessRightFields />

      <FieldsetDivider />

      <FastField
        as={Textfield}
        size='sm'
        type='date'
        name='issued'
        label={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.issued}
            helpAriaLabel={localization.datasetForm.fieldLabel.issued}
            tagColor='info'
          >
            {localization.datasetForm.fieldLabel.issued}
          </LabelWithHelpTextAndTag>
        }
      />
    </>
  );
};
