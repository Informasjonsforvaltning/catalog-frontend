import { TitleWithTag } from '@catalog-frontend/ui';
import { TextareaWithPrefix } from './texarea-with-prefix';
import { localization } from '@catalog-frontend/utils';
import { FormikLanguageFieldset } from './formik-language-fieldset';
import { Box } from '@digdir/designsystemet-react';

export const ExampleSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='eksempel'
        as={TextareaWithPrefix}
        legend={<TitleWithTag title={localization.conceptForm.fieldLabel.example} />}
      />
    </Box>
  );
};
