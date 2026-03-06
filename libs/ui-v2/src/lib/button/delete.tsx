import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { TrashIcon } from "@navikt/aksel-icons";

const DeleteButton = ({
  children = localization.button.delete,
  ...props
}: ButtonProps) => (
  <Button variant="tertiary" data-color="danger" data-size="sm" {...props}>
    <TrashIcon title={localization.icon.trash} fontSize="1.2rem" />
    {children}
  </Button>
);

export { DeleteButton };
