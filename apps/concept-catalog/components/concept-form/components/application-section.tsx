import { FastField, useFormikContext } from 'formik';
import { HelpText, Paragraph, Textfield } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';

export const ApplicationSection = () => {
  const { errors } = useFormikContext<Concept>();

  return (
    <div>
      <div className={styles.fieldSet}>
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.tekst'
          label={
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
          error={errors?.omfang?.['tekst']}
        />
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.uri'
          label={<TitleWithTag title='Lenke til referanse' />}
          error={errors?.omfang?.['uri']}
        />
      </div>
    </div>
  );
};
