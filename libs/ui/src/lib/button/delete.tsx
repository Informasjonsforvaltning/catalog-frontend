import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { TrashIcon } from '@navikt/aksel-icons';

const DeleteButton = ({ children = localization.button.delete, ...props }: ButtonProps) => (
  <Button
    {...props}
    asChild
    variant='tertiary'
    color='danger'
    // style={{ width: 'fit-content' }}
  >
    <span>
      <TrashIcon />
      {children}
    </span>
  </Button>
);

export { DeleteButton };
