import { localization } from '@catalog-frontend/utils';
import { FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';

export const ContactPointSection = () => {
  const contactPointOptions = [
    { valuePath: 'contactPoint[0].email', value: 'email', label: localization.email },
    {
      valuePath: 'contactPoint[0].hasTelephone',
      value: 'hasTelephone',
      label: localization.telephone,
    },
    { valuePath: 'contactPoint[0].hasURL', value: 'hasURL', label: localization.contactPoint.form },
    {
      valuePath: 'contactPoint[0].organizationUnit',
      value: 'organizationUnit',
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
