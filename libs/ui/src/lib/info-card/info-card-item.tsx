import cn from 'classnames';
import React, { forwardRef } from 'react';
import classes from './info-card.module.css';
import { HelpMarkdown } from '../help-markdown';

export const labelColor = ['neutral', 'light'] as const;
type LabelColor = (typeof labelColor)[number];

export interface InfoCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Label
   */
  label?: string;
  /**
   * Label color
   */
  labelColor?: LabelColor;
  /**
   * Label level
   */
  labelLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Content in Accordion.Item
   * Should include one Accordion.Header and one Accordion.Content
   */
  children: React.ReactNode;

  /**
   * Helptext
   **/

  helpText?: string;
}

export type InfoCardItemType = React.ForwardRefExoticComponent<InfoCardItemProps & React.RefAttributes<HTMLDivElement>>;

const InfoCardItem: InfoCardItemType = forwardRef(
  ({ label, labelColor = 'neutral', labelLevel = 3, children, className, helpText, ...rest }, ref) => {
    const HeadingTag = `h${labelLevel}` as React.ElementType;

    return (
      <div
        className={cn(classes.item, className)}
        ref={ref}
        {...rest}
      >
        <div>
          <span className={classes.set}>
            {label && <HeadingTag className={cn(classes.fieldHeading, classes[labelColor])}>{label}</HeadingTag>}

            {helpText && (
              <HelpMarkdown
                size='sm'
                title={`helptext-${label}`}
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
