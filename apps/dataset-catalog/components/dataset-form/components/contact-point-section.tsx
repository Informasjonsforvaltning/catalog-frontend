import { localization } from '@catalog-frontend/utils';
import { FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: 'contactPoint[0].email', label: localization.email },
    {
      valuePath: 'contactPoint[0].hasTelephone',
      label: localization.telephone,
    },
    { valuePath: 'contactPoint[0].hasURL', label: localization.contactPoint.form },
    {
      valuePath: 'contactPoint[0].organizationUnit',
      label: localization.contactPoint.organizationUnit,
    },
  ];

  return (
    <>
      <FormikOptionalFieldsFieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.contactFields}
            tagTitle={localization.tag.required}
          >
            {localization.dataServiceForm.fieldLabel.contactFields}
          </TitleWithHelpTextAndTag>
        }
        availableFields={contactPointOptions}
      />
    </>
  );
};
