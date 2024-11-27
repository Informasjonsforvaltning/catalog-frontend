import { Box, HelpText, Paragraph } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const TermSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='anbefaltTerm.navn'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.prefLabel}
                <HelpText
                  title={localization.conceptForm.fieldLabel.prefLabel}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Termen blir sett på som best egnet for begrepet og skal finnes på både bokmål og nynorsk.
                  </Paragraph>
                </HelpText>
              </>
            }
            tagTitle={localization.tag.required}
          />
        }
        requiredLanguages={['nb', 'nn']}
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='tillatTerm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.altLabel}
                <HelpText
                  title={localization.conceptForm.fieldLabel.altLabel}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Termen blir sett på som best egnet for begrepet, og som blir brukt i tillegg til en anbefalt term.
                  </Paragraph>
                </HelpText>
              </>
            }
            tagTitle={localization.tag.recommended}
            tagColor='info'
          />
        }
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='frarådetTerm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.hiddenLabel}
                <HelpText
                  title={localization.conceptForm.fieldLabel.hiddenLabel}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Term som er synonym med en anbefalt term, men merket med betegnelsesstatus som ikke ønsket.
                  </Paragraph>
                </HelpText>
              </>
            }
          />
        }
      />
    </Box>
  );
};
