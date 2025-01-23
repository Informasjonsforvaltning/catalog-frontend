'use client';
import { DataService } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Checkbox, CheckboxGroup } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import styles from '../data-service-form.module.css';
import { useState } from 'react';

export const ContactPointSection = () => {
  const { setFieldValue, values, errors } = useFormikContext<DataService>();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    ...(values.contactPoint?.email ? ['email'] : []),
    ...(values.contactPoint?.phone ? ['phone'] : []),
    ...(values.contactPoint?.organizationUnit ? ['organizationUnit'] : []),
    ...(values.contactPoint?.url ? ['url'] : []),
  ]);

  const contactPointOptions = [
    { value: 'email', label: localization.email },
    { value: 'phone', label: localization.telephone },
    { value: 'url', label: localization.contactPoint.form },
    { value: 'organizationUnit', label: localization.contactPoint.organizationUnit },
  ];

  const handleContactChange = (value: string[]) => {
    setSelectedFields(value);
    contactPointOptions.forEach((option) => {
      if (!value.includes(option.value)) {
        setFieldValue(`contactPoint.${option.value}`, '');
      }
    });
  };

  return (
    <>
      <CheckboxGroup
        size='sm'
        value={selectedFields}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.contactPoint}
            tagTitle={localization.tag.required}
          >
            {localization.dataServiceForm.heading.contactPoint}
          </TitleWithHelpTextAndTag>
        }
        onChange={handleContactChange}
      >
        {contactPointOptions.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <div className={styles.fieldContainer}>
        {selectedFields.includes('email') && (
          <FastField
            as={Textfield}
            name='contactPoint.email'
            size='sm'
            label={localization.email}
            // @ts-expect-error: email exists on the object
            error={errors?.contactPoint?.email}
          />
        )}

        {selectedFields.includes('phone') && (
          <FastField
            as={Textfield}
            name='contactPoint.phone'
            size='sm'
            label={localization.telephone}
            // @ts-expect-error: phone exists on the object
            error={errors?.contactPoint?.phone}
          />
        )}
        {selectedFields.includes('organizationUnit') && (
          <FastField
            as={Textfield}
            name='contactPoint.organizationUnit'
            size='sm'
            label={localization.contactPoint.organizationUnit}
          />
        )}
        {selectedFields.includes('url') && (
          <FastField
            as={Textfield}
            name='contactPoint.url'
            size='sm'
            label={localization.contactPoint.form}
            // @ts-expect-error: url exists on the object
            error={errors?.contactPoint?.url}
          />
        )}
      </div>
    </>
  );
};
