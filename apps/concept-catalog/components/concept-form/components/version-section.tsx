import { Box } from '@digdir/designsystemet-react';
import { VersionFieldset } from './version-fieldset';

export const VersionSection = () => {
  return (
    <Box>
      <VersionFieldset name='versjonsnr' />
      {/**
       * TODO Version note will be available as a modal dialog at a later stage.
       * 
      <FieldsetDivider />
      <LanguageFieldset
        name='versjonsNote'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.versionNote}
          >
            {localization.conceptForm.fieldLabel.versionNote}
          </TitleWithHelpTextAndTag>  
        }
      />
       */}
    </Box>
  );
};
