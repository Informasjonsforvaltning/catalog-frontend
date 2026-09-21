import {
  FieldsetDivider,
  FormikLanguageFieldset,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Textfield } from "@digdir/designsystemet-react";

export const AboutSection = () => {
  return (
    <div>
      <FormikLanguageFieldset
        name="title"
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.informationModelForm.helptext.title}
          >
            {localization.informationModelForm.fieldLabel.title}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <FormikLanguageFieldset
        name="description"
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.informationModelForm.helptext.description}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.informationModelForm.fieldLabel.description}
          </TitleWithHelpTextAndTag>
        }
      />
    </div>
  );
};
