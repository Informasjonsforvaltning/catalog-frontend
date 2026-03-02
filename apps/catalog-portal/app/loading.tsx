import React from "react";
import { Spinner } from "@digdir/designsystemet-react";
import styles from "./loading.module.css";
import { localization } from "@catalog-frontend/utils";

const Loading = () => {
  return (
    <div className={styles.spinner}>
      <Spinner aria-label={localization.loading} data-size="xl" />
    </div>
  );
};

export default Loading;
