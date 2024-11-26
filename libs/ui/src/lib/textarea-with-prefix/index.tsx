import { ReactNode } from 'react';
import { Box, Textarea, TextareaProps } from '@digdir/designsystemet-react';
import styles from './textarea-with-prefix.module.scss';

export type TextareaWithPrefixProps = {
  prefix: ReactNode;
} & TextareaProps;

export const TextareaWithPrefix = ({ prefix, label, ...props }: TextareaWithPrefixProps) => {
  return (
    <Box className={styles.textareaWithPrefix}>
      {label && (
        <label>
          {label}
        </label>
      )}
      <Box>
        <Box className={styles.prefix}>
            {prefix}
        </Box>        
        <Textarea {...props} />
      </Box>
    </Box>
  );
};
