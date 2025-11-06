import { createElement, PropsWithChildren } from "react";
import styles from "./form-heading.module.css";

type Props = {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
} & PropsWithChildren;

const FormHeading = ({ children, headingLevel = 3 }: Props) => {
  return createElement(
    `h${headingLevel}`,
    { className: styles.formHeading },
    children,
  );
};

export { FormHeading };
