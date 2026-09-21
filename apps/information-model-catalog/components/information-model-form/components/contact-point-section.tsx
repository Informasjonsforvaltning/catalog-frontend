"use client";

import { localization } from "@catalog-frontend/utils";
import {
  FormikLanguageFieldset,
  FormikOptionalFieldsFieldset,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { Textfield } from "@digdir/designsystemet-react";

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: "contactPoints[0].email", label: localization.email },
    {
      valuePath: "contactPoints[0].telephone",
      label: localization.telephone,
    },
    {
      valuePath: "contactPoints[0].url",
      label: localization.contactPage,
    },
  ];

  return (
    <>
      <FormikLanguageFieldset
        name="contactPoints[0].name"
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.informationModelForm.helptext.contactName}
          >
            {localization.informationModelForm.fieldLabel.contactName}
          </TitleWithHelpTextAndTag>
        }
      />
      <FormikOptionalFieldsFieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.informationModelForm.helptext.contactFields}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.informationModelForm.fieldLabel.contactFields}
          </TitleWithHelpTextAndTag>
        }
        availableFields={contactPointOptions}
        errorPath="contactPoints"
      />
    </>
  );
};
