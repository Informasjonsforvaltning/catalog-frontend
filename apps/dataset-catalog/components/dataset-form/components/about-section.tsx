import { FormikLanguageFieldset, TitleWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box, Textfield } from '@digdir/designsystemet-react';
import { FastField } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightFields } from './access-rights-fields';

export const AboutSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.datasetForm.helptext.title}
          >
            {localization.title}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.description}
            tagTitle={localization.tag.required}
          >
            {localization.description}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
      <AccessRightFields />
      <FieldsetDivider />
      <FastField
        style={{ width: 'fit-content' }}
        as={Textfield}
        size='sm'
        type='date'
        name='issued'
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.issued}
            tagColor='info'
          >
            {localization.datasetForm.fieldLabel.issued}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
