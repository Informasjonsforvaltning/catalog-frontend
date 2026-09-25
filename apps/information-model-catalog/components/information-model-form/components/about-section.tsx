import {
  FieldsetDivider,
  FormikLanguageFieldset,
  Select,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { InformationModel, ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Fieldset, Textfield } from "@digdir/designsystemet-react";
import { Field, useFormikContext } from "formik";

type Props = {
  statuses: ReferenceDataCode[];
};

export const AboutSection = ({ statuses }: Props) => {
  const errors = useFormikContext<InformationModel>()?.errors;

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

      <FieldsetDivider />

      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.informationModelForm.helptext.status}
          >
            {localization.informationModelForm.fieldLabel.status}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <Field as={Select} name="status">
          <option value="">{localization.informationModelForm.noStatus}</option>
          {statuses.map((status) => (
            <option key={status.code} value={status.uri}>
              {getTranslateText(status.label)}
            </option>
          ))}
        </Field>
      </Fieldset>

      <FieldsetDivider />

      <Field
        as={Textfield}
        name="homepage"
        data-size="sm"
        placeholder="https://"
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.informationModelForm.helptext.homepage}
          >
            {localization.informationModelForm.fieldLabel.homepage}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.homepage}
      />
    </div>
  );
};
