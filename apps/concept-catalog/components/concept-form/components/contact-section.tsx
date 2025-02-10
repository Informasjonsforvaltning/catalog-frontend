import { useEffect, useState } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Box, Textfield, CheckboxGroup, Checkbox, ErrorMessage } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';

export const ContactSection = () => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const contactOptions = [
    {
      label: localization.conceptForm.fieldLabel.emailAddress,
      value: 'harEpost',
    },
    {
      label: localization.conceptForm.fieldLabel.phoneNumber,
      value: 'harTelefon',
    },
  ];

  const handleContactChange = (value: string[]) => {
    setSelectedFields(value);
    contactOptions.forEach((option) => {
      if (!value.includes(option.value)) {
        setFieldValue(`kontaktpunkt.${option.value}`, null);
      }
    });
  };

  useEffect(() => {
    setSelectedFields([
      ...(values.kontaktpunkt?.harEpost ? ['harEpost'] : []),
      ...(values.kontaktpunkt?.harTelefon ? ['harTelefon'] : []),
    ]);
  }, [values.kontaktpunkt])

  return (
    <Box className={styles.contactSection}>
      <CheckboxGroup
        size='sm'
        value={selectedFields}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.contactInfo}
            tagTitle={localization.tag.required}
          >
            {localization.conceptForm.fieldLabel.contactInfo}
          </TitleWithHelpTextAndTag>
        }
        onChange={handleContactChange}
      >
        {contactOptions.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
          >
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      {selectedFields.includes('harEpost') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harEpost'
          size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.emailAddress}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harEpost']}
        />
      )}
      {selectedFields.includes('harTelefon') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harTelefon'
          size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.phoneNumber}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harTelefon']}
        />
      )}
      {selectedFields.includes('harSkjema') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harSkjema'
          size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.contactForm}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harSkjema']}
        />
      )}
      {typeof errors?.kontaktpunkt === 'string' ? (
        <ErrorMessage size='sm'>{errors?.kontaktpunkt}</ErrorMessage>
      ) : undefined}
    </Box>
  );
};
