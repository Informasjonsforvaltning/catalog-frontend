import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { PlusCircleIcon } from "@navikt/aksel-icons";

const AddButton = ({ children = localization.add, ...props }: ButtonProps) => (
  <div>
    <Button variant="tertiary" data-size="sm" {...props}>
      <PlusCircleIcon fontSize="1.2rem" />
      {children}
    </Button>
  </div>
);

export { AddButton };
