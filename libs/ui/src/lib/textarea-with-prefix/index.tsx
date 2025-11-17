import { forwardRef, ReactNode } from 'react';
import { Card, Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import styles from './textarea-with-prefix.module.scss';

export type TextareaWithPrefixProps = {
  prefix: ReactNode;
} & TextfieldProps;

export const TextareaWithPrefix = forwardRef<HTMLTextAreaElement, TextareaWithPrefixProps>(
  ({ prefix, label, ...props }, ref) => {
    return (
      <Card className={styles.textareaWithPrefix}>
        {label && <label>{label}</label>}
        <Card>
          <Card className={styles.prefix}>{prefix}</Card>
          <Textfield
            ref={ref}
            {...(props as TextfieldProps & { multiline: true })}
            multiline={true}
          />
        </Card>
      </Card>
    );
  },
);

TextareaWithPrefix.displayName = 'TextareaWithPrefix';
