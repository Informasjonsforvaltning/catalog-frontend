import { forwardRef, ReactNode } from "react";
import { Textarea, TextareaProps } from "@digdir/designsystemet-react";
import styles from "./textarea-with-prefix.module.scss";

export type TextareaWithPrefixProps = {
  label: string;
  prefix: ReactNode;
} & TextareaProps;

export const TextareaWithPrefix = forwardRef<
  HTMLTextAreaElement,
  TextareaWithPrefixProps
>(({ prefix, label, ...props }, ref) => {
  return (
    <div className={styles.textareaWithPrefix}>
      {label && <label>{label}</label>}
      <div>
        <div className={styles.prefix}>{prefix}</div>
        <Textarea ref={ref} {...props} />
      </div>
    </div>
  );
});

TextareaWithPrefix.displayName = "TextareaWithPrefix";
