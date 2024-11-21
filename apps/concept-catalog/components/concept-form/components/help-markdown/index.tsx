import { HelpText, HelpTextProps } from '@digdir/designsystemet-react';
import Markdown from 'react-markdown';
import styles from './help-markdown.module.scss';

type HelpMarkdownProps = {
  children: string;
} & Omit<HelpTextProps, 'children'>;

export const HelpMarkdown = ({ children, ...props }: HelpMarkdownProps) => {
  return (
    <HelpText
      size='sm'
      type='button'
      {...props}
    >
      <div className={styles.markdownContent}>
        <Markdown>{children}</Markdown>
      </div>
    </HelpText>
  );
};
