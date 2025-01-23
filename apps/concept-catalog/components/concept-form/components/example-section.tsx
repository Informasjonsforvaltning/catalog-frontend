import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const ExampleSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='eksempel'
        errorMessage={localization.conceptForm.validation.languageRequired}
        errorArgs={{label: 'Eksempel'}}
        as={TextareaWithPrefix}
        legend={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.example}</TitleWithHelpTextAndTag>}
      />
    </Box>
  );
};
