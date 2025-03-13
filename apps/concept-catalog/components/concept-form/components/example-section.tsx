import { Box } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';

type ExampleSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const ExampleSection = ({ markDirty = false, readOnly = false }: ExampleSectionProps) => {
  const { initialValues, values } = useFormikContext<Concept>();
  return (
    <Box>
      <FormikLanguageFieldset
        name='eksempel'
        as={TextareaWithPrefix}
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            changed={markDirty && !isEqual(get(initialValues, 'eksempel'), get(values, 'eksempel'))}
          >
            {localization.conceptForm.fieldLabel.example}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
