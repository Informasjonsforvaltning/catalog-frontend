import cn from "classnames";
import style from "./dialog-actions.module.css";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const DialogActions = (props: Props) => {
  const { children, className } = props;
  return <div className={cn(style.actions, className)}>{children}</div>;
};
