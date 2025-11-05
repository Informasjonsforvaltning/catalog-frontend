"use client";

import { FC } from "react";
import { Spinner as SpinnerBase } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import classes from "./spinner.module.css";

export interface SpinnerProps {
  title?: string;
  size?: "xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge";
}

const Spinner: FC<SpinnerProps> = ({
  title = localization.loading,
  size = "xlarge",
}) => {
  return (
    <div className={classes.spinner}>
      <SpinnerBase title={title} size={size} />
    </div>
  );
};

export { Spinner };
