import styles from "./custom-error.module.css";
import { localization } from "@catalog-frontend/utils";

const CustomError = () => (
  <div className={styles.error}>
    <span>{localization.somethingWentWrong}</span>
  </div>
);

export { CustomError };
