import React, { Children, isValidElement, ReactNode } from 'react';
import styles from './form-layout.module.css';

interface FormLayoutProps {
  title?: ReactNode;
  children: ReactNode;
  buttonsRow?: ReactNode;
}

interface ButtonsRowProps {
  children: ReactNode;
}

export const FormLayout = ({ title, children }: FormLayoutProps) => {
  const childrenArray = Children.toArray(children);
  const buttons = childrenArray.find((child) => isValidElement(child) && child.type === FormLayout.ButtonsRow);
  const form = childrenArray.find((child) => isValidElement(child) && child.type !== FormLayout.ButtonsRow);

  return (
    <div className={styles.layout}>
      <div className={styles.heading}>{title}</div>
      {buttons && <div className={styles.buttonsRowWrapper}>{buttons}</div>}

      <div className={styles.content}>
        <div className={styles.languageCheckboxes}>
          <p>Her kommer mest sannsynlig meny</p>
        </div>
        {form}
      </div>
    </div>
  );
};

const Buttons = ({ children }: { children: ReactNode }) => <div className={styles.buttonsRow}>{children}</div>;
FormLayout.ButtonsRow = Buttons;

export default FormLayout;
