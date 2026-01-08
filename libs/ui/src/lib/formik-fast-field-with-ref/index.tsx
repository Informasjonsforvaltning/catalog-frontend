"use client";

import { forwardRef } from "react";
import { FastField, FastFieldAttributes } from "formik";
import { Textfield } from "@digdir/designsystemet-react";
import { TextareaWithPrefix } from "../textarea-with-prefix";

type FastFieldWithRefProps = {
  as?: typeof Textfield | typeof TextareaWithPrefix;
  prefix?: string;
} & FastFieldAttributes<any>;

export const FastFieldWithRef = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FastFieldWithRefProps
>(({ as: Component = Textfield, ...props }, ref) => (
  <FastField {...props}>
    {({ field }: { field: any }) => (
      <Component {...field} {...props} value={field.value ?? ""} ref={ref} />
    )}
  </FastField>
));

FastFieldWithRef.displayName = "FastFieldWithRef";
