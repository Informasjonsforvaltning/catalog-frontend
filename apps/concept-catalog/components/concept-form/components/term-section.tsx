import { FieldsetDivider, FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useFormikContext } from 'formik';
import { Concept } from '@catalog-frontend/types';
import { get, isEmpty, isEqual } from 'lodash';

type TermSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const TermSection = ({ changed, readOnly }: TermSectionProps) => {
  return (
    <div>
      <FormikLanguageFieldset
        name='anbefaltTerm.navn'
        readOnly={readOnly}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.prefLabel}
            tagTitle={localization.tag.required}
            changed={changed?.includes('anbefaltTerm')}
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
            changed={changed?.includes('tillattTerm')}
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
            changed={changed?.includes('frarådetTerm')}
          >
            {localization.conceptForm.fieldLabel.hiddenLabel}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
    </div>
  );
};
