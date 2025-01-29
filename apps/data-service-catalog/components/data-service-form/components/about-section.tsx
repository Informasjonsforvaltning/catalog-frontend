import { FormikLanguageFieldset, LabelWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';

export const AboutSection = () => {
  return (
    <>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        legend={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.title}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.title}
          >
            {localization.dataServiceForm.fieldLabel.title}
          </LabelWithHelpTextAndTag>
        }
      />

      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        legend={
          <LabelWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.description}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.description}
          >
            {localization.dataServiceForm.fieldLabel.description}
          </LabelWithHelpTextAndTag>
        }
      />
    </>
  );
};
