import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset } from './formik-language-fieldset';
import { TextareaWithPrefix } from './texarea-with-prefix';

export const RemarkSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='merknad'
        as={TextareaWithPrefix}        
        legend={
          <TitleWithTag
            title={localization.conceptForm.fieldLabel.remark}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          />
        }
      />
    </Box>
  );
};
