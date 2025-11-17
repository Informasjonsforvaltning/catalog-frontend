import { Card } from '@digdir/designsystemet-react';
import { FormikLanguageFieldset, TextareaWithPrefix, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEmpty, isEqual } from 'lodash';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';

type RemarkSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const RemarkSection = ({ changed, readOnly }: RemarkSectionProps) => {
  return (
    <Card>
      <FormikLanguageFieldset
        name='merknad'
        as={TextareaWithPrefix}
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            changed={changed?.includes('merknad')}
          >
            {localization.conceptForm.fieldLabel.remark}
          </TitleWithHelpTextAndTag>
        }
      />
    </Card>
  );
};
