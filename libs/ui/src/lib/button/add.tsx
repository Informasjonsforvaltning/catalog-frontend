import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import styles from './button.module.css';

const AddButton = ({ children = localization.add, ...props }: ButtonProps) => (
  <Button
    {...props}
    asChild
    variant='tertiary'
    className={styles.add}
  >
    <span>
      <PlusCircleIcon />
      {children}
    </span>
  </Button>
);

export { AddButton };
