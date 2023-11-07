'use client';

import { Button as DigdirButton } from '@digdir/design-system-react';
import cn from './button.module.css';

export const Button = ({ children, ...props }: any) => (
  <DigdirButton
    {...props}
    className={cn.button}
  >
    {children}
  </DigdirButton>
);

export default Button;
