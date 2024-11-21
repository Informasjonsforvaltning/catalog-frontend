import { Box, Textfield } from '@digdir/designsystemet-react';
import styles from '../concept-form.module.scss';
import { MinusIcon } from '@navikt/aksel-icons';

export const PeriodSection = () => {
  return (
    <Box className={styles.periodSection}>
      <Textfield type='date' size='sm' label='Gyldig fra og med' />
      <MinusIcon title="a11y-title" fontSize="1rem" />
      <Textfield type='date' size='sm' label='Gyldig til og med'/>      
    </Box>
  );
};
