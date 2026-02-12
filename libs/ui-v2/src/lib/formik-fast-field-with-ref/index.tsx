"use client";

import { forwardRef } from "react";
import { FastField, FastFieldAttributes, FastFieldProps } from "formik";
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
    {({ field, form }: FastFieldProps) => (
      <Component
        {...field}
        {...props}
        ref={ref}
        onBlur={(e: React.FocusEvent) => {
          field.onBlur(e);
          if (typeof field.value === "string") {
            form.setFieldValue(field.name, field.value.trim());
          }
        }}
      />
    )}
  </FastField>
));

FastFieldWithRef.displayName = "FastFieldWithRef";
