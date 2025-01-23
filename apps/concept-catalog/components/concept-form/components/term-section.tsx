import { Box } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const TermSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='anbefaltTerm.navn'
        errorMessage={localization.conceptForm.validation.languageRequired}
        errorArgs={{ label: localization.conceptForm.fieldLabel.prefLabel }}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.prefLabel}
            tagTitle={localization.tag.required}
          >
            {localization.conceptForm.fieldLabel.prefLabel}
          </TitleWithHelpTextAndTag>
        }
        requiredLanguages={['nb', 'nn']}
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='tillattTerm'
        errorMessage={localization.conceptForm.validation.languageRequired}
        errorArgs={{ label: localization.conceptForm.fieldLabel.altLabel }}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.altLabel}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          >
            {localization.conceptForm.fieldLabel.altLabel}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='frarådetTerm'
        errorMessage={localization.conceptForm.validation.languageRequired}
        errorArgs={{ label: localization.conceptForm.fieldLabel.hiddenLabel }}
        legend={
          <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.hiddenLabel}>
            {localization.conceptForm.fieldLabel.hiddenLabel}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
    </Box>
  );
};
