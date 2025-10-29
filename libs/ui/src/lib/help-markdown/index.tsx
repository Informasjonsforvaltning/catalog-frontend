'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import Markdown, { Components } from 'react-markdown';
import classNames from 'classnames';
import { Link, Popover } from '@digdir/designsystemet-react';
import type { Placement } from '@floating-ui/react';
import styles from './help-markdown.module.scss';

type HelpTextProps = {
  /**
   * Required descriptive label for screen readers.
   **/
  'aria-label': string;
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;

  severity?: 'info' | 'warning' | 'danger';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>;

const markdownComponents: Partial<Components> = {
  a: ({ href, children, ...props }) => {
    const targetBlank = href?.startsWith('http://') || href?.startsWith('https://');
    return (
      <Link
        href={href}
        {...(targetBlank ? { target: '_blank' } : {})}
        {...props}
      >
        {children}
      </Link>
    );
  },
};

export const HelpMarkdown = forwardRef<HTMLButtonElement, HelpTextProps>(function HelpMarkdown(
  { placement = 'right-end', severity = 'info', children, ...rest },
  ref,
) {
  return (
    <Popover
      size='sm'
      placement={placement}
      variant={severity}
    >
      <Popover.Trigger
        className={classNames(styles.helpMarkdown, styles[severity])}
        ref={ref}
        variant='tertiary'
        data-color='warning'
        {...rest}
      />
      <Popover.Content>
        {typeof children === 'string' ? (
          <div className={styles.markdownContent}>
            <Markdown components={markdownComponents}>{children}</Markdown>
          </div>
        ) : (
          children
        )}
      </Popover.Content>
    </Popover>
  );
});
