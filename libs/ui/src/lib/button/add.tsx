import { Button, ButtonProps } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import styles from "./button.module.css";

const AddButton = ({ children = localization.add, ...props }: ButtonProps) => (
  <div>
    <Button variant="tertiary" className={styles.add} size="sm" {...props}>
      <span className={styles.withIcon}>
        <PlusCircleIcon fontSize={"1.2rem"} />
        {children}
      </span>
    </Button>
  </div>
);

export { AddButton };
