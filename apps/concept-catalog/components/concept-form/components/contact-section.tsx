import { Concept } from '@catalog-frontend/types';
import { Box, Fieldset, Textfield, CheckboxGroup, Checkbox } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import { useState } from 'react';
import { TitleWithTag } from '@catalog-frontend/ui';
import styles from '../concept-form.module.scss';
import { localization } from '@catalog-frontend/utils';
import { HelpMarkdown } from './help-markdown';

export const ContactSection = () => {
  const { errors, values } = useFormikContext<Concept>();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    ...(values.kontaktpunkt?.harEpost ? ['email'] : []),
    ...(values.kontaktpunkt?.harTelefon ? ['phone'] : []),
    ...(values.kontaktpunkt?.harSkjema ? ['form'] : []),
  ]);

  const contactOptions = [
    {
      label: 'E-post',
      value: 'email',
    },
    {
      label: 'Telefonnummer',
      value: 'phone',
    },
    {
      label: 'Kontaktskjema',
      value: 'form',
    },
  ];

  const handleContactChange = (value: string[]) => {
    setSelectedFields(value);
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
        error={errors?.kontaktpunkt}
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
      {selectedFields.includes('email') && (
        <Fieldset
          legend={<TitleWithTag title={'E-postadresse'} />}
          size='sm'
        >
          <FastField
            as={Textfield}
            name='kontaktpunkt.harEpost'
            size='sm'
          />
        </Fieldset>
      )}
      {selectedFields.includes('phone') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harTelefon'
          size='sm'
          label={<TitleWithTag title={'Telefonnummer'} />}
        />
      )}
      {selectedFields.includes('form') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harSkjema'
          size='sm'
          label={<TitleWithTag title={'Contactskjema'} />}
        />
      )}
    </Box>
  );
};
