import Markdown from 'react-markdown';
import classNames from 'classnames';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Popover } from '@digdir/designsystemet-react';
import type { Placement } from '@floating-ui/react';
import styles from './help-markdown.module.scss';

export type HelpTextProps = {
  /**
   * Required descriptive label for screen readers.
   **/
  "aria-label": string;  
  /**
   * Placement of the Popover.
   * @default 'right'
   */
  placement?: Placement;

  severity?: "info" | "warning" | "danger"; 
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;

export const HelpMarkdown = forwardRef<HTMLButtonElement, HelpTextProps>(
  function HelpText(
    { placement = "right", severity = "info", children, ...rest },
    ref
  ) {

    return (
      <Popover size='sm' placement={placement} variant={severity}>
        <Popover.Trigger
          className={classNames(styles.helpMarkdown, styles[severity])}
          ref={ref}
          variant="tertiary"
          data-color="warning"
          {...rest}       
        />
        <Popover.Content>
          {typeof children === 'string' ? (            
            <Markdown className={styles.markdownContent}> 
              {children}
            </Markdown>
          ) : (
            <>{children}</>            
          )}
        </Popover.Content>
      </Popover>
    );
  }
);

