import { useState } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Box, Fieldset, Textfield, CheckboxGroup, Checkbox, ErrorMessage } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { HelpMarkdown, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';

export const ContactSection = () => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    ...(values.kontaktpunkt?.harEpost ? ['harEpost'] : []),
    ...(values.kontaktpunkt?.harTelefon ? ['harTelefon'] : []),
    ...(values.kontaktpunkt?.harSkjema ? ['harSkjema'] : []),
  ]);

  const contactOptions = [
    {
      label: 'E-post',
      value: 'harEpost',
    },
    {
      label: 'Telefonnummer',
      value: 'harTelefon',
    },
    {
      label: 'Kontaktskjema',
      value: 'harSkjema',
    },
  ];

  const handleContactChange = (value: string[]) => {
    setSelectedFields(value);
    contactOptions.forEach(option => {
      if(!value.includes(option.value)) {
        setFieldValue(`kontaktpunkt.${option.value}`, null);
      }
    })
  };

  return (
    <Box className={styles.contactSection}>
      <CheckboxGroup
        size='sm'
        value={selectedFields}
        legend={
          <TitleWithTag
            title={
              <>
                Kontaktinformasjon
                <HelpMarkdown title={'Hjelpetekst kontaktinformasjon'}>
                  {localization.conceptForm.helpText.contactInfo}
                </HelpMarkdown>
              </>
            }
            tagTitle={localization.tag.required}
          />
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
        <Fieldset
          legend={<TitleWithTag title={'E-postadresse'} />}
          size='sm'
        >
          <FastField
            as={Textfield}
            name='kontaktpunkt.harEpost'
            size='sm'
            error={errors?.kontaktpunkt?.['harEpost']}
          />
        </Fieldset>
      )}
      {selectedFields.includes('harTelefon') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harTelefon'
          size='sm'
          label={<TitleWithTag title={'Telefonnummer'} />}
          error={errors?.kontaktpunkt?.['harTelefon']}
        />
      )}
      {selectedFields.includes('harSkjema') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harSkjema'
          size='sm'
          label={<TitleWithTag title={'Contactskjema'} />}
          error={errors?.kontaktpunkt?.['harSkjema']}
        />
      )}
      {typeof errors?.kontaktpunkt === 'string' ? <ErrorMessage size='sm'>{errors?.kontaktpunkt}</ErrorMessage> : undefined}
    </Box>
  );
};
