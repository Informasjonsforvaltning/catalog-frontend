import { Box } from '@digdir/designsystemet-react';
import {
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';

type RemarkSectionProps = {
  markDirty?: boolean;
}

export const RemarkSection = ({ markDirty }: RemarkSectionProps) => {
  const { initialValues, values } = useFormikContext<Concept>();

  return (
    <Box>
      <FormikLanguageFieldset
        name='merknad'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            changed={markDirty && !isEqual(get(initialValues, 'merknad'), get(values, 'merknad'))}
          >
            {localization.conceptForm.fieldLabel.remark}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
