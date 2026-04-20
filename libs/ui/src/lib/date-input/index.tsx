"use client";

import { type ReactNode, forwardRef } from "react";
import { Textfield, type TextfieldProps } from "@digdir/designsystemet-react";
import { parseNorwegianDateToISO } from "@catalog-frontend/utils";

type DateInputProps = Omit<
  Extract<
    Extract<TextfieldProps, { multiline?: false | undefined }>,
    { label: ReactNode }
  >,
  "type" | "multiline"
>;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ onPaste, onChange, ...props }, ref) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData("text");
      const isoDate = parseNorwegianDateToISO(pastedText);

      if (isoDate && onChange) {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const syntheticEvent = {
          target: { name: target.name, value: isoDate },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
        return;
      }

      onPaste?.(e);
    };

    return (
      <Textfield
        {...props}
        ref={ref}
        type="date"
        onChange={onChange}
        onPaste={handlePaste}
      />
    );
  },
);

DateInput.displayName = "DateInput";
