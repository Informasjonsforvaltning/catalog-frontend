import { PropsWithChildren } from "react";
import classNames from "classnames";
import styles from "./button-bar.module.scss";

const ButtonBar = ({ children }: PropsWithChildren) => {
  return (
    <div className={classNames("container", styles.buttonBar)}>{children}</div>
  );
};

export { ButtonBar };
