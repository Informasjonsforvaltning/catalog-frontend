import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { TrashIcon } from '@navikt/aksel-icons';
import styles from './button.module.css';

const DeleteButton = ({ children = localization.button.delete, ...props }: ButtonProps) => (
  <Button
    {...props}
    variant='tertiary'
    color='danger'
    size='sm'
  >
    <span className={styles.withIcon}>
      <TrashIcon fontSize={'1.2rem'} />
      {children}
    </span>
  </Button>
);

export { DeleteButton };
