'use client';

import { Button as DigdirButton, ButtonProps } from '@digdir/design-system-react';
import cn from './button.module.css';

export const Button = ({ children, ...props }: ButtonProps) => (
  <DigdirButton
    {...props}
    className={cn.button}
    size={props.size ?? 'small'}
  >
    {children}
  </DigdirButton>
);

export default Button;
