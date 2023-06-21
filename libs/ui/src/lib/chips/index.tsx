import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './chips.module.css';
import type { ToggleChipType } from './toggle';
import ToggleChip from './toggle';
import type { RemovableChipType } from './removable';
import RemovableChip from './removable';

interface ChipsComponent extends React.ForwardRefExoticComponent<ChipsProps & React.RefAttributes<HTMLUListElement>> {
  Removable: RemovableChipType;
  Toggle: ToggleChipType;
}

export const chipsSize = ['xsmall', 'small'] as const;
type ChipsSize = (typeof chipsSize)[number];

export interface ChipsProps extends React.HTMLAttributes<HTMLUListElement> {
  size?: ChipsSize;
}

export const Chips = forwardRef<HTMLUListElement, ChipsProps>(
  ({ className, size = 'small', children, ...rest }, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(className, classes.chips, classes[size])}
    >
      {children}
    </ul>
  ),
) as ChipsComponent;

Chips.Toggle = ToggleChip;
Chips.Removable = RemovableChip;

export default Chips;
