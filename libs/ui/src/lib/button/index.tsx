import { Button as DigdirButton } from '@digdir/design-system-react';
import cn from './button.module.css';

const Button = ({ children, ...props }: any) => (
  <DigdirButton
    {...props}
    className={cn.button}
  >
    {children}
  </DigdirButton>
);

export { Button };
