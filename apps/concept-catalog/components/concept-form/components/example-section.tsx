import { TitleWithTag } from '@catalog-frontend/ui';
import { TextareaWithPrefix } from './texarea';
import { localization } from '@catalog-frontend/utils';
import { LanguageFieldset } from './language-fieldset';
import { Box } from '@digdir/designsystemet-react';

export const ExampleSection = () => {
  return (
    <Box>
      <LanguageFieldset
        name='eksempel'
        as={TextareaWithPrefix}
        legend={<TitleWithTag title={localization.conceptForm.fieldLabel.example} />}
      />
    </Box>
  );
};
