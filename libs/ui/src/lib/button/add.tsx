import { Button, ButtonProps } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { PlusCircleIcon } from '@navikt/aksel-icons';

const AddButton = ({ children = localization.add, ...props }: ButtonProps) => (
  <Button
    {...props}
    asChild
    variant='tertiary'
  >
    <span>
      <PlusCircleIcon />
      {children}
    </span>
  </Button>
);

export { AddButton };
