import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

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
