import { Box, HelpText, Paragraph } from '@digdir/designsystemet-react';
import { LanguageFieldset } from './language-fieldset';
import { TextareaWithPrefix } from './texarea';
import { FieldsetDivider } from './fieldset-divider';
import { VersionFieldset } from './version-fieldset';
import { localization } from '@catalog-frontend/utils';
import { TitleWithTag } from '@catalog-frontend/ui';

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
