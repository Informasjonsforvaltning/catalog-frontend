import { FormikLanguageFieldset, TitleWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box, Textfield } from '@digdir/designsystemet-react';
import { FastField } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightFields } from './access-rights-fields';
import { SpacialCombobox } from './spatial-combobox';
import { TemporalModal } from './details-section/temporal-modal';

interface Props {
  referenceDataEnv: string;
  isMobility?: boolean;
}

export const AboutSection = ({
  referenceDataEnv,
  isMobility: isMobility
}: Props) => {
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
      { isMobility && <>
          <SpacialCombobox 
            referenceDataEnv={referenceDataEnv}
            isMobility={isMobility}
          />
          <TemporalModal
            label={
              <TitleWithHelpTextAndTag
                tagTitle={localization.tag.required}
                helpText={localization.datasetForm.helptext.temporal}
              >
                {localization.datasetForm.fieldLabel.temporal}
              </TitleWithHelpTextAndTag>
            }
          />
          <FieldsetDivider />
        </> 
      }
      <AccessRightFields isMobility= {isMobility}/>
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
