import { localization } from '@catalog-frontend/utils';
import { FormikLanguageFieldset, FormikOptionalFieldsFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { Textfield } from '@digdir/designsystemet-react';
import { FastField } from 'formik';

type Props = {
  isMobility?: boolean;
}

export const ContactPointSection = ({
  isMobility: isMobility
}: Props) => {
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
      {!isMobility &&
        <div>
          <FormikLanguageFieldset
            name={'contactPoints[0].name'}
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
      }
      {isMobility &&
        <div>
           <FastField
            name={'contactPoints[0].name'}
            as={Textfield}
            label={<TitleWithHelpTextAndTag
                tagTitle={localization.tag.required}
                helpText={localization.datasetForm.helptext.contactName}
              >
                {localization.datasetForm.fieldLabel.contactName}
              </TitleWithHelpTextAndTag>}
            size='sm'
          />
        </div>
      }

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
        errorPath={'contactPoints'}
      />
    </>
  );
};
