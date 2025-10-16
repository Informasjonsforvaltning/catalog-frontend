import { localization } from '@catalog-frontend/utils';
import { FormikLanguageFieldset, FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Textfield } from '@digdir/designsystemet-react';

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: 'contactPoints[0].email', label: localization.email },
    {
      valuePath: 'contactPoints[0].phone',
      label: localization.telephone,
    },
    { valuePath: 'contactPoints[0].url', label: localization.contactPoint.form },
  ];

  return (
    <>
      <div>
        <FormikLanguageFieldset
          name='contactPoints[0].category'
          as={Textfield}
          legend={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.serviceForm.helptext.category}
            >
              {localization.serviceForm.fieldLabel.category}
            </TitleWithHelpTextAndTag>
          }
        />
      </div>

      <FormikOptionalFieldsFieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.serviceForm.helptext.contactPoint}
            tagTitle={localization.tag.required}
          >
            {localization.serviceForm.fieldLabel.contactPoint}
          </TitleWithHelpTextAndTag>
        }
        availableFields={contactPointOptions}
        errorPath='contactPoints'
      />
    </>
  );
};
