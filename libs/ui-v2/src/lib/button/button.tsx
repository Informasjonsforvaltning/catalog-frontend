"use client";

import {
  Button as DigdirButton,
  ButtonProps as DsButtonProps,
} from "@digdir/designsystemet-react";
import cn from "./button.module.css";
import { ElementType } from "react";

export interface ButtonProps extends DsButtonProps {
  as?: ElementType;
  href?: string;
}

export const Button = ({ children, ...props }: ButtonProps) => (
  <DigdirButton className={cn.button} {...props}>
    {children}
  </DigdirButton>
);

export default Button;
