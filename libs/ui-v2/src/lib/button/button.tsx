"use client";

import {
  Button as DigdirButton,
  ButtonProps as DsButtonProps,
} from "@digdir/designsystemet-react";
import { ElementType } from "react";

export interface ButtonProps extends DsButtonProps {
  as?: ElementType;
  href?: string;
}

export const Button = (props: ButtonProps) => <DigdirButton {...props} />;

export default Button;
