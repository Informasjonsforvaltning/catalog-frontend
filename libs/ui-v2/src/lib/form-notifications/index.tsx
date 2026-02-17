import { ReactNode } from "react";
import { Alert } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import styles from "./form-notifications.module.css";

export type FormNotificationsProps = {
  isValid: boolean;
  hasUnsavedChanges: boolean;
};

export const getFormNotifications = ({
  isValid,
  hasUnsavedChanges,
}: FormNotificationsProps): ReactNode[] => [
  ...(!isValid
    ? [
        <Alert
          key="form-error"
          data-size="sm"
          data-color="danger"
          className={styles.notification}
        >
          {localization.validation.formError}
        </Alert>,
      ]
    : []),
  ...(hasUnsavedChanges
    ? [
        <Alert
          key="unsaved-changes"
          data-size="sm"
          data-color="warning"
          className={styles.notification}
        >
          {localization.validation.unsavedChanges}
        </Alert>,
      ]
    : []),
];
