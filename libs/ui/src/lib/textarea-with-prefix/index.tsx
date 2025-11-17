import { forwardRef, ReactNode } from 'react';
import { Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import styles from './textarea-with-prefix.module.scss';

export type TextareaWithPrefixProps = {
  prefix: ReactNode;
} & TextfieldProps;

export const TextareaWithPrefix = forwardRef<HTMLTextAreaElement, TextareaWithPrefixProps>(
  ({ prefix, label, ...props }, ref) => {
    return (
      <div className={styles.textareaWithPrefix}>
        {label && <label>{label}</label>}
        <div>
          <div className={styles.prefix}>{prefix}</div>
          <Textfield
            ref={ref}
            {...(props as TextfieldProps & { multiline: true })}
            multiline={true}
          />
        </div>
      </div>
    );
  },
);

TextareaWithPrefix.displayName = 'TextareaWithPrefix';
