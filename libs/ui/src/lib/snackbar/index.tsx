"use client";

import React, { Children, MouseEventHandler, ReactNode } from "react";
import styles from "./snackbar.module.scss";
import classNames from "classnames";
import { Alert, Button } from "@digdir/designsystemet-react";
import { XMarkIcon } from "@navikt/aksel-icons";

type SnackbarProps = {
  children: ReactNode;
  duration?: number;
  fadeIn?: boolean;
};

export type SnackbarSeverity = "success" | "danger" | "info" | "warning";

type SnackbarItemProps = {
  children: ReactNode;
  severity?: SnackbarSeverity;
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const SnackbarItem = ({
  children,
  severity = "info",
  onClose,
}: SnackbarItemProps) => {
  return (
    <Alert
      className={classNames(styles.snackbarItem)}
      size="sm"
      severity={severity}
    >
      <div>{children}</div>
      <Button size="sm" variant="tertiary" onClick={onClose}>
        <XMarkIcon fontSize="1.5rem" />
      </Button>
    </Alert>
  );
};

const Snackbar = ({ children, fadeIn = true }: SnackbarProps) => {
  const items = Children.toArray(children)
    .filter(
      (child) => React.isValidElement(child) && child.type === SnackbarItem,
    )
    .map((child) => child as React.ReactElement);

  return (
    <div
      className={classNames(
        styles.snackbar,
        ...(fadeIn ? [styles.fadeIn] : []),
      )}
    >
      {items}
    </div>
  );
};

Snackbar.Item = SnackbarItem;

export { Snackbar };
