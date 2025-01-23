'use client';
import { Dataset } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Checkbox, CheckboxGroup } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import styles from '../dataset-form.module.css';
import { useState } from 'react';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';

export const ContactPointSection = () => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    ...(values.contactPoint?.[0]?.email ? ['email'] : []),
    ...(values.contactPoint?.[0]?.hasTelephone ? ['hasTelephone'] : []),
    ...(values.contactPoint?.[0]?.organizationUnit ? ['organizationUnit'] : []),
    ...(values.contactPoint?.[0]?.hasURL ? ['hasURL'] : []),
  ]);

  const contactPointOptions = [
    { value: 'email', label: localization.email },
    { value: 'hasTelephone', label: localization.telephone },
    { value: 'hasURL', label: localization.contactPoint.form },
    { value: 'organizationUnit', label: localization.contactPoint.organizationUnit },
  ];

  const handleContactChange = (value: string[]) => {
    setSelectedFields(value);
    contactPointOptions.forEach((option) => {
      if (!value.includes(option.value)) {
        setFieldValue(`contactPoint[0].${option.value}`, '');
      }
    });
  };

  return (
    <>
      <CheckboxGroup
        className={styles.field}
        size='sm'
        value={selectedFields}
        // @ts-expect-error: the error exists
        error={Array.isArray(errors?.contactPoint) && errors.contactPoint.length > 0 ? undefined : errors?.contactPoint}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.contactPoint}
            tagTitle={localization.tag.required}
          >
            {localization.datasetForm.heading.contactPoint}
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
            name='contactPoint[0].email'
            size='sm'
            label={localization.email}
            className={styles.field}
            // @ts-expect-error: email exists on the object
            error={errors?.contactPoint?.[0]?.email}
          />
        )}

        {selectedFields.includes('hasTelephone') && (
          <FastField
            as={Textfield}
            name='contactPoint[0].hasTelephone'
            size='sm'
            label={localization.telephone}
            className={styles.field}
            // @ts-expect-error: hasTelephone exists on the object
            error={errors?.contactPoint?.[0]?.hasTelephone}
          />
        )}
        {selectedFields.includes('organizationUnit') && (
          <FastField
            as={Textfield}
            name='contactPoint[0].organizationUnit'
            size='sm'
            label={localization.contactPoint.organizationUnit}
            className={styles.field}
          />
        )}
        {selectedFields.includes('hasURL') && (
          <FastField
            as={Textfield}
            name='contactPoint[0].hasURL'
            size='sm'
            label={localization.contactPoint.form}
            className={styles.field}
            // @ts-expect-error: hasURL exists on the object
            error={errors?.contactPoint?.[0]?.hasURL}
          />
        )}
      </div>
    </>
  );
};
