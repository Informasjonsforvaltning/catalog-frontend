import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { TrashIcon } from "@navikt/aksel-icons";
import styles from "./button.module.css";

const DeleteButton = ({
  children = localization.button.delete,
  ...props
}: ButtonProps) => (
  <Button variant="tertiary" color="danger" size="sm" {...props}>
    <span className={styles.withIcon}>
      <TrashIcon title={localization.icon.trash} fontSize={"1.2rem"} />
      {children}
    </span>
  </Button>
);

export { DeleteButton };
