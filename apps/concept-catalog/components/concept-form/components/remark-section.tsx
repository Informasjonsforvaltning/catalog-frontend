import { Box } from '@digdir/designsystemet-react';
import {
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const RemarkSection = () => {
  return (
    <Box>
      <FormikLanguageFieldset
        name='merknad'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
          >
            {localization.conceptForm.fieldLabel.remark}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
