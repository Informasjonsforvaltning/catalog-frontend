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
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.versionNote}
                <HelpText
                  title={localization.conceptForm.fieldLabel.versionNote}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Egenskapen brukes til å oppgi versjonsnoter til en versjon av et begrep. Egenskapen bør gjentas når
                    teksten finnes på flere skriftspråk.
                  </Paragraph>
                </HelpText>
              </>
            }
          />
        }
      />
       */}
    </Box>
  );
};
