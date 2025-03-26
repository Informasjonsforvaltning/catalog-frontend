import { Box } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';
import { get, isEmpty, isEqual } from 'lodash';

type TermSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const TermSection = ({ markDirty, readOnly }: TermSectionProps) => {
  const { initialValues, values } = useFormikContext<Concept>();

  const fieldIsChanged = (name: string) => {
    const a = get(initialValues, name);
    const b = get(values, name);
    if (isEmpty(a) && isEmpty(b)) {
      return false;
    }
    return markDirty && !isEqual(a, b);
  };

  return (
    <Box>
      <FormikLanguageFieldset
        name='anbefaltTerm.navn'
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.prefLabel}
            tagTitle={localization.tag.required}
            changed={fieldIsChanged('anbefaltTerm.navn')}
          >
            {localization.conceptForm.fieldLabel.prefLabel}
          </TitleWithHelpTextAndTag>
        }
        requiredLanguages={['nb', 'nn']}
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='tillattTerm'
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.altLabel}
            tagTitle={localization.tag.recommended}
            tagColor='info'
            changed={fieldIsChanged('tillattTerm')}
          >
            {localization.conceptForm.fieldLabel.altLabel}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='frarådetTerm'
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.hiddenLabel}
            changed={fieldIsChanged('frarådetTerm')}
          >
            {localization.conceptForm.fieldLabel.hiddenLabel}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
    </Box>
  );
};
