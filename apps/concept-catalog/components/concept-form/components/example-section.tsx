import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const ExampleSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='eksempel'
        errorFieldLabel='Eksempel'
        as={TextareaWithPrefix}
        legend={<TitleWithTag title={localization.conceptForm.fieldLabel.example} />}
      />
    </Box>
  );
};
