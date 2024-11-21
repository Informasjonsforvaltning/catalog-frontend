import { Box, Textfield } from '@digdir/designsystemet-react';
import { MinusIcon } from '@navikt/aksel-icons';
import { FastField } from 'formik';
import styles from '../concept-form.module.scss';

export const PeriodSection = () => {
  return (
    <Box className={styles.periodSection}>
      <FastField as={Textfield} type='date' name='gyldigFom' size='sm' label='Gyldig fra og med' />
      <MinusIcon title="a11y-title" fontSize="1rem" />
      <FastField as={Textfield} type='date' name='gyldigTom' size='sm' label='Gyldig til og med'/>      
    </Box>
  );
};
