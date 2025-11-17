import {
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Card, Textfield } from '@digdir/designsystemet-react';

export const AboutSection = () => {
  return (
    <Card>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.title}
          >
            {localization.dataServiceForm.fieldLabel.title}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.description}>
            {localization.dataServiceForm.fieldLabel.description}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <FormikLanguageFieldset
        name='keywords'
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.keywords}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          >
            {localization.dataServiceForm.fieldLabel.keywords}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />
    </Card>
  );
};
