import { useEffect, useState } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Card, Textfield, CheckboxGroup, Checkbox, ErrorMessage } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';
import { get, isEmpty, isEqual, isNil } from 'lodash';

type ContactSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const ContactSection = ({ changed, readOnly = false }: ContactSectionProps) => {
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
    contactOptions.forEach((option) => {
      if (!value.includes(option.value)) {
        setFieldValue(`kontaktpunkt.${option.value}`, null);
      } else if (isNil(values.kontaktpunkt?.[option.value])) {
        setFieldValue(`kontaktpunkt.${option.value}`, '');
      }
    });
  };

  useEffect(() => {
    setSelectedFields([
      ...(!isNil(values.kontaktpunkt?.harEpost) ? ['harEpost'] : []),
      ...(!isNil(values.kontaktpunkt?.harTelefon) ? ['harTelefon'] : []),
    ]);
  }, [values.kontaktpunkt]);

  return (
    <Card className={styles.contactSection}>
      <CheckboxGroup
        data-size='sm'
        value={selectedFields}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.contactInfo}
            tagTitle={localization.tag.required}
            changed={['kontaktpunkt.harEpost', 'kontaktpunkt.harTelefon', 'kontaktpunkt.harSkjema'].some((field) =>
              changed?.includes(field),
            )}
          >
            {localization.conceptForm.fieldLabel.contactInfo}
          </TitleWithHelpTextAndTag>
        }
        onChange={handleContactChange}
        readOnly={readOnly}
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
          data-size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.emailAddress}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harEpost']}
          readOnly={readOnly}
        />
      )}
      {selectedFields.includes('harTelefon') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harTelefon'
          data-size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.phoneNumber}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harTelefon']}
          readOnly={readOnly}
        />
      )}
      {selectedFields.includes('harSkjema') && (
        <FastField
          as={Textfield}
          name='kontaktpunkt.harSkjema'
          data-size='sm'
          label={<TitleWithHelpTextAndTag>{localization.conceptForm.fieldLabel.contactForm}</TitleWithHelpTextAndTag>}
          error={errors?.kontaktpunkt?.['harSkjema']}
          readOnly={readOnly}
        />
      )}
      {typeof errors?.kontaktpunkt === 'string' ? (
        <ErrorMessage data-size='sm'>{errors?.kontaktpunkt}</ErrorMessage>
      ) : undefined}
    </Card>
  );
};
