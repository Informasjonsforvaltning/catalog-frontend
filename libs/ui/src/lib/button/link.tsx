import { Button as DigdirButton, ButtonProps as DsButtonProps } from '@digdir/designsystemet-react';
import cn from './button.module.css';
import Link from 'next/link';

export interface LinkButtonProps extends DsButtonProps {
  href: string;
}

const LinkButton = ({ href, children, ...props }: LinkButtonProps) => (
  <DigdirButton
    {...props}
    className={cn.button}
    size={props.size ?? 'small'}
    asChild
  >
    <Link href={href}>{children}</Link>
  </DigdirButton>
);

export { LinkButton };
