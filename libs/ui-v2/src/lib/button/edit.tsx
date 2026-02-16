import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { PencilWritingIcon } from "@navikt/aksel-icons";

const EditButton = ({
  children = localization.button.edit,
  ...props
}: ButtonProps) => (
  <Button variant="tertiary" data-size="sm" {...props}>
    <PencilWritingIcon fontSize="1.3rem" />
    {children}
  </Button>
);

export { EditButton };
