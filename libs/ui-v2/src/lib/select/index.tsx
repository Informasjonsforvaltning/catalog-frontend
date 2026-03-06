"use client";

import { Select as DsSelect, SelectProps } from "@digdir/designsystemet-react";
import styles from "./style.module.css";

export type SelectOption = {
  label: string;
  value: string;
};

export const Select = (props: SelectProps) => {
  return (
    <div className={styles.select}>
      <DsSelect {...props} />
    </div>
  );
};
