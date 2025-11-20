import React, { ReactNode } from "react";
import styles from "./page-layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="center">
        <div className={styles.page}>{children}</div>
      </div>
    </>
  );
};
