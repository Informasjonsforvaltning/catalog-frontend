import { Box } from '@digdir/designsystemet-react';
import {
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEmpty, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';

type RemarkSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
}

export const RemarkSection = ({ markDirty, readOnly }: RemarkSectionProps) => {
  const { initialValues, values } = useFormikContext<Concept>();

  const fieldIsChanged = () => {
      const a = get(initialValues,  'merknad');
      const b = get(values,  'merknad');
      if (isEmpty(a) && isEmpty(b)) {
        return false;
      }
      return markDirty && !isEqual(a, b);
    };

  return (
    <Box>
      <FormikLanguageFieldset
        name='merknad'
        as={TextareaWithPrefix}
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            changed={fieldIsChanged()}
          >
            {localization.conceptForm.fieldLabel.remark}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
