import { DataService } from '@catalog-frontend/types';
import { FormikLanguageFieldset, LabelWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

export const TitleSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        requiredLanguages={['nb']}
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
        requiredLanguages={['nb']}
        legend={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
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
