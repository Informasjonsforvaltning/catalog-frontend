'use client';
import { Dataset } from '@catalog-frontend/types';
import { HelpMarkdown, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield, Box, Checkbox, CheckboxGroup } from '@digdir/designsystemet-react';
import { Field, useFormikContext } from 'formik';
import styles from '../dataset-form.module.css';
import { useState } from 'react';

export const ContactPointSection = () => {
  const { setFieldValue, values, errors } = useFormikContext<Dataset>();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    ...(values.contactPoint?.[0].email ? ['email'] : []),
    ...(values.contactPoint?.[0].hasTelephone ? ['hasTelephone'] : []),
    ...(values.contactPoint?.[0].organizationUnit ? ['organizationUnit'] : []),
    ...(values.contactPoint?.[0].hasURL ? ['hasURL'] : []),
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
        setFieldValue(`contactPoint.${option.value}`, null);
      }
    });
  };

  return (
    <Box>
      <CheckboxGroup
        className={styles.field}
        size='sm'
        value={selectedFields}
        legend={
          <TitleWithTag
            title={
              <>
                {localization.datasetForm.heading.contactPoint}
                <HelpMarkdown title={'Hjelpetekst kontaktinformasjon'}>
                  {localization.datasetForm.helptext.contactPoint}
                </HelpMarkdown>
              </>
            }
            tagTitle={localization.tag.required}
          />
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

      {selectedFields.includes('email') && (
        <Field
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
        <Field
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
        <Field
          as={Textfield}
          name='contactPoint[0].organizationUnit'
          size='sm'
          label={localization.contactPoint.organizationUnit}
          className={styles.field}
        />
      )}
      {selectedFields.includes('hasURL') && (
        <Field
          as={Textfield}
          name='contactPoint[0].hasURL'
          size='sm'
          label={localization.contactPoint.form}
          className={styles.field}
          // @ts-expect-error: hasURL exists on the object
          error={errors?.contactPoint?.[0]?.hasURL}
        />
      )}
    </Box>
  );
};
