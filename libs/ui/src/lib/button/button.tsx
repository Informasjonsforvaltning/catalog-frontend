'use client';

import { Button as DigdirButton, ButtonProps } from '@digdir/design-system-react';
import cn from './button.module.css';
import { ElementType } from 'react';

interface Props extends ButtonProps {
  as?: ElementType;
}

export const Button = ({ children, ...props }: Props) => (
  <DigdirButton
    {...props}
    className={cn.button}
    size={props.size ?? 'small'}
  >
    {children}
  </DigdirButton>
);

export default Button;
