import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import classes from './chips.module.css';
import { localization } from '@catalog-frontend/utils';

export interface RemovableChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Chip label
   */
  children: string;
  /**
   * Click callback
   */
  onDelete?: () => void;
  /**
   * Replaces label read for screen-readers
   */
  removeLabel?: string;
}

export type RemovableChipType = React.ForwardRefExoticComponent<
  RemovableChipProps & React.RefAttributes<HTMLButtonElement>
>;

const RemovableChip: RemovableChipType = forwardRef(({ className, children, onDelete, ...rest }, ref) => {
  return (
    <li className={className}>
      <button
        ref={ref}
        {...rest}
        aria-label={localization.button.removeFilter}
        className={cn(classes.chip, classes.removable)}
        onClick={(e) => {
          onDelete?.();
          rest?.onClick?.(e);
        }}
      >
        <div className={classes.content}>
          <div className={classes.text}>{children}</div>
          <span className={classes.xmark}>
            <XMarkIcon aria-hidden />
          </span>
        </div>
      </button>
    </li>
  );
});

RemovableChip.displayName = 'RemovableChip';

export default RemovableChip;
