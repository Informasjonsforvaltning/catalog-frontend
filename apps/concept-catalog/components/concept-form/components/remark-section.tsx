import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box } from '@digdir/designsystemet-react';
import { LanguageFieldset } from './language-fieldset';
import { TextareaWithPrefix } from './texarea';

export const RemarkSection = () => {
  return (
    <Box>
      <LanguageFieldset
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
