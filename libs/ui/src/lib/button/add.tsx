import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import styles from './button.module.css';

const AddButton = ({ children = localization.add, ...props }: ButtonProps) => (
  <Button
    variant='tertiary'
    className={styles.add}
    size='sm'
    {...props}
  >
    <span className={styles.withIcon}>
      <PlusCircleIcon fontSize={'1.3rem'} />
      {children}
    </span>
  </Button>
);

export { AddButton };
