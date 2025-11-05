import React from "react";
import { Spinner } from "@digdir/designsystemet-react";
import styles from "./loading.module.css";
import { localization } from "@catalog-frontend/utils";

const Loading = () => {
  return (
    <div className={styles.spinner}>
      <Spinner title={localization.loading} size="xlarge" />
    </div>
  );
};

export default Loading;
