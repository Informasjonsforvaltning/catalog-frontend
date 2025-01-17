import cn from 'classnames';
import React, { forwardRef } from 'react';
import classes from './info-card.module.css';
import { HelpMarkdown } from '../help-markdown';

export const headingColor = ['neutral', 'light'] as const;
type HeadingColor = (typeof headingColor)[number];

export interface InfoCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Heading
   */
  title?: string;
  /**
   * Heading color
   */
  headingColor?: HeadingColor;
  /**
   * Heading level
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Content in Item
   */
  children: React.ReactNode;

  /**
   * Helptext
   **/

  helpText?: string;
}

export type InfoCardItemType = React.ForwardRefExoticComponent<InfoCardItemProps & React.RefAttributes<HTMLDivElement>>;

const InfoCardItem: InfoCardItemType = forwardRef(
  ({ title, headingColor = 'neutral', headingLevel = 3, children, className, helpText, ...rest }, ref) => {
    const HeadingTag = `h${headingLevel}` as React.ElementType;

    return (
      <div
        className={cn(classes.item, className)}
        ref={ref}
        {...rest}
      >
        <div>
          <span className={classes.set}>
            {title && <HeadingTag className={cn(classes.fieldHeading, classes[headingColor])}>{title}</HeadingTag>}

            {helpText && (
              <HelpMarkdown
                size='sm'
                title={`helptext-${title}`}
              >
                {helpText}
              </HelpMarkdown>
            )}
          </span>
          <div className={classes.wrap}>{children}</div>
        </div>
      </div>
    );
  },
);

export default InfoCardItem;
