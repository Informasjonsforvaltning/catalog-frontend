import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { PencilWritingIcon } from "@navikt/aksel-icons";
import styles from "./button.module.css";

const EditButton = ({
  children = localization.button.edit,
  ...props
}: ButtonProps) => (
  <Button variant="tertiary" data-size="sm" {...props}>
    <span className={styles.withIcon}>
      <PencilWritingIcon fontSize="1.3rem" />
      {children}
    </span>
  </Button>
);

export { EditButton };
