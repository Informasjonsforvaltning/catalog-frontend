import {
  FormikLanguageFieldset,
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
    </div>
  );
};
