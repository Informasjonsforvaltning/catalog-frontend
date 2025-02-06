import { Box, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { MinusIcon } from '@navikt/aksel-icons';
import { FastField, useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export const PeriodSection = () => {
  const { values, errors } = useFormikContext<Concept>();
  return (
    <Fieldset
      size='sm'
      legend={
        <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.period}>
          {localization.conceptForm.fieldLabel.period}
        </TitleWithHelpTextAndTag>
      }
    >
      <div className={styles.periodSection}>
        <FastField
          as={Textfield}
          type='date'
          name='gyldigFom'
          size='sm'
          label='Gyldig fra og med'
          error={errors.gyldigFom}
        />
        <MinusIcon
          title='a11y-title'
          fontSize='1rem'
        />
        <FastField
          as={Textfield}
          type='date'
          name='gyldigTom'
          size='sm'
          label='Gyldig til og med'
          error={errors.gyldigTom}
          min={values.gyldigFom}
        />
      </div>
    </Fieldset>
  );
};
