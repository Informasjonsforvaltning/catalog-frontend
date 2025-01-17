import cn from 'classnames';
import React, { forwardRef } from 'react';
import classes from './info-card.module.css';
import { HelpMarkdown } from '../help-markdown';
import { Heading } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';

export const headingColor = ['neutral', 'light'] as const;
type HeadingColor = (typeof headingColor)[number];
type Size =
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

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
  headingLevel?: HeadingLevel;
  /**
   * Content in Item
   */
  children: React.ReactNode;

  /**
   * Helptext
   **/

  helpText?: string;

  /** Heading size **/

  headingSize?: Size;
}

export type InfoCardItemType = React.ForwardRefExoticComponent<InfoCardItemProps & React.RefAttributes<HTMLDivElement>>;

const InfoCardItem: InfoCardItemType = forwardRef(
  (
    { title, headingColor = 'neutral', children, className, helpText, headingSize = '2xs', headingLevel = 3, ...rest },
    ref,
  ) => {
    return (
      <div
        className={cn(classes.item, className)}
        ref={ref}
        {...rest}
      >
        <div>
          <span className={classes.set}>
            {title && (
              <Heading
                level={headingLevel}
                size={headingSize}
                className={cn(classes.fieldHeading, classes[headingColor])}
              >
                {title}
              </Heading>
            )}

            {helpText && (
              <HelpMarkdown
                size='sm'
                title={`${localization.helpText} ${title}`}
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
