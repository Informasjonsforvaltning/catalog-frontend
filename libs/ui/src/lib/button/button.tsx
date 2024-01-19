'use client';

import { Button as DigdirButton, ButtonProps as DsButtonProps } from '@digdir/design-system-react';
import cn from './button.module.css';
import { ElementType } from 'react';

export interface ButtonProps extends DsButtonProps {
  as?: ElementType;
  href?: string;
}

export const Button = ({ children, ...props }: ButtonProps) => (
  <DigdirButton
    {...props}
    className={cn.button}
    size={props.size ?? 'small'}
  >
    {children}
  </DigdirButton>
);
