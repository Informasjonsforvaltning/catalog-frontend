import {
  Button as DigdirButton,
  ButtonProps as DsButtonProps,
} from "@digdir/designsystemet-react";
import Link from "next/link";

export interface LinkButtonProps extends DsButtonProps {
  href: string;
}

const LinkButton = ({ href, children, ...props }: LinkButtonProps) => (
  <DigdirButton data-size="sm" {...props} asChild>
    <Link href={href}>{children}</Link>
  </DigdirButton>
);

export { LinkButton };
