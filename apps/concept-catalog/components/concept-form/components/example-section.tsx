import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEmpty, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';

type ExampleSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const ExampleSection = ({ markDirty = false, readOnly = false }: ExampleSectionProps) => {
  const { initialValues, values } = useFormikContext<Concept>();

  const fieldIsChanged = () => {
    const a = get(initialValues, 'eksempel');
    const b = get(values, 'eksempel');
    if (isEmpty(a) && isEmpty(b)) {
      return false;
    }
    return markDirty && !isEqual(a, b);
  };

  return (
    <Box>
      <FormikLanguageFieldset
        name='eksempel'
        as={TextareaWithPrefix}
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag changed={fieldIsChanged()}>
            {localization.conceptForm.fieldLabel.example}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
