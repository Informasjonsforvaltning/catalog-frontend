import { Box, Button, Paragraph, Textarea, TextareaProps } from '@digdir/designsystemet-react';
import stylesLabel from '@digdir/designsystemet-css/label.css';
import styles from './textarea.module.scss';
import classNames from 'classnames';
import { ReactNode } from 'react';

export type TextareaWithPrefixProps = {
  prefix: ReactNode;
} & TextareaProps;

export const TextareaWithPrefix = ({ prefix, label, ...props }: TextareaWithPrefixProps) => {
  return (
    <Box className={styles.textareaWithPrefix}>
      {label && (
        <label
          className={classNames(
            stylesLabel['fds-label'],
            stylesLabel['fds-label--sm'],
            stylesLabel['fds-label--medium-weight'],
          )}
        >
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
