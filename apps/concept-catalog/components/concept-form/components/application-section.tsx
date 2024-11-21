import { Concept } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Button, Divider, Fieldset, HelpText, Paragraph, Textfield } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { PropsWithChildren } from 'react';
import { LanguageFieldset } from './language-fieldset';
import { FieldsetDivider } from './fieldset-divider';

const LangField = ({ children }: PropsWithChildren) => <div className={styles.languageField}>{children}</div>;

export const ApplicationSection = () => {
  const { errors } = useFormikContext<Concept>();

  return (
    <div>
      <div className={styles.fieldSet}>
        <LanguageFieldset
          name='omfang.tekst'
          legend={
            <TitleWithTag
              title={
                <>
                  {localization.conceptForm.fieldLabel.description}
                  <HelpText
                    title={localization.conceptForm.fieldLabel.description}
                    type='button'
                    size='sm'
                  >
                    <Paragraph size='sm'>
                      Egenskapen brukes til å oppgi verdiområde, oppgitt som tekst og/eller referanse til der dette er
                      spesifisert. Hvis tekst brukes, og hvis teksten finnes på flere skriftspråk, bør egenskapen
                      gjentas for hvert språk.
                    </Paragraph>
                    <br/>
                    <Paragraph size='sm'>
                      Eksempel: 
                    </Paragraph>
                  </HelpText>
                </>
              }
            />
          }
        />
        <FieldsetDivider />
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.url'
          label={<TitleWithTag title='Lenke til referanse' />}
          error={errors?.['omfang.url']}
        />
      </div>
    </div>
  );
};
