import { Box } from '@digdir/designsystemet-react';
import { VersionFieldset } from './version-fieldset';

type VersionSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const VersionSection = ({ markDirty = false, readOnly = false }: VersionSectionProps) => {
  return (
    <Box>
      <VersionFieldset name='versjonsnr' markDirty={markDirty} readOnly={readOnly} />
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
