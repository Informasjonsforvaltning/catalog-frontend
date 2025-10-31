import { localization } from '@catalog-frontend/utils';
import { FormikLanguageFieldset, FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Textfield } from '@digdir/designsystemet-react';

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: 'contactPoints[0].email', label: localization.email },
    {
      valuePath: 'contactPoints[0].telephone',
      label: localization.telephone,
    },
    { valuePath: 'contactPoints[0].contactPage', label: localization.contactPoint.form },
  ];

  return (
    <>
      <div>
        <FormikLanguageFieldset
          name='contactPoints[0].category'
          as={Textfield}
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.serviceForm.helptext.category}
              tagColor='info'
              tagTitle={localization.tag.recommended}
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
            tagColor='info'
            tagTitle={localization.tag.recommended}
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
