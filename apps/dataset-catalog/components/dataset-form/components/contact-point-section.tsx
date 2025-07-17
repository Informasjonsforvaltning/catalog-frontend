import { localization } from '@catalog-frontend/utils';
import { FormikLanguageFieldset, FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Textfield } from '@digdir/designsystemet-react';

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: 'contactPoint[0].email', label: localization.email },
    {
      valuePath: 'contactPoint[0].hasTelephone',
      label: localization.telephone,
    },
    { valuePath: 'contactPoint[0].hasURL', label: localization.contactPoint.form },
  ];

  return (
    <>
      <div>
        <FormikLanguageFieldset
          name={'contactPoint[0].name'}
          as={Textfield}
          legend={
            <TitleWithHelpTextAndTag
              tagTitle={localization.tag.required}
              helpText={localization.datasetForm.helptext.contactName}
            >
              {localization.datasetForm.fieldLabel.contactName}
            </TitleWithHelpTextAndTag>
          }
        />
      </div>

      <FormikOptionalFieldsFieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.contactFields}
            tagTitle={localization.tag.required}
          >
            {localization.datasetForm.fieldLabel.contactFields}
          </TitleWithHelpTextAndTag>
        }
        availableFields={contactPointOptions}
        errorPath={'contactPoint'}
      />
    </>
  );
};
