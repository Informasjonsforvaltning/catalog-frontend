import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { PencilWritingIcon } from '@navikt/aksel-icons';
import styles from './button.module.css';

const EditButton = ({ children = localization.button.edit, ...props }: ButtonProps) => (
  <Button
    {...props}
    variant='tertiary'
    size='sm'
  >
    <span className={styles.withIcon}>
      <PencilWritingIcon fontSize={'1.2rem'} />
      {children}
    </span>
  </Button>
);

export { EditButton };
