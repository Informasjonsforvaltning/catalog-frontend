"use client";

import { FC } from "react";
import { Spinner as SpinnerBase } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import classes from "./spinner.module.css";

export interface SpinnerProps {
  title?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
}

const Spinner: FC<SpinnerProps> = ({
  title = localization.loading,
  size = "xl",
}) => {
  return (
    <div className={classes.spinner}>
      <SpinnerBase aria-label={title} data-size={size} />
    </div>
  );
};

export { Spinner };
