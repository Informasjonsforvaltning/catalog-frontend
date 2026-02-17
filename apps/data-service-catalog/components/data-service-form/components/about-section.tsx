import {
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  FastFieldWithRef,
} from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import { Textfield } from "@digdir/designsystemet-react";
import { DataService } from "@catalog-frontend/types";
import { useFormikContext } from "formik";

export const AboutSection = () => {
  const { errors } = useFormikContext<DataService>();

  return (
    <div>
      <FormikLanguageFieldset
        name="title"
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
        name="description"
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.description}
          >
            {localization.dataServiceForm.fieldLabel.description}
          </TitleWithHelpTextAndTag>
        }
      />

      <FieldsetDivider />

      <FormikLanguageFieldset
        name="keywords"
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.keywords}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.dataServiceForm.fieldLabel.keywords}
          </TitleWithHelpTextAndTag>
        }
        multiple
      />

      <FieldsetDivider />

      <FastFieldWithRef
        as={Textfield}
        name="version"
        size="sm"
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.version}
          >
            {localization.dataServiceForm.fieldLabel.version}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.version}
      />
    </div>
  );
};
