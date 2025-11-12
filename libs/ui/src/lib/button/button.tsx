'use client';

import { Button as DsButton, ButtonProps as DsButtonProps } from '@digdir/designsystemet-react';
import cn from './button.module.css';
import { ElementType } from 'react';

export interface ButtonProps extends DsButtonProps {
  as?: ElementType;
  href?: string;
}

export const Button = ({ children, 'data-size': dataSize = 'sm', ...props }: ButtonProps) => (
  <DsButton
    {...props}
    className={cn.button}
    data-size={dataSize}
  >
    {children}
  </DsButton>
);

export default Button;
