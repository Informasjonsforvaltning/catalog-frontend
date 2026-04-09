"use client";

import { formatDateNoToISO } from "@catalog-frontend/utils";

interface Props {
  setValue?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export const DatePickerPasteWrapper = ({ setValue, children }: Props) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const isoDate = formatDateNoToISO(e.clipboardData.getData("Text"));

    if (isoDate) {
      e.preventDefault();
      const syntheticEvent = {
        target: {
          name: (e.target as HTMLInputElement).name,
          value: isoDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      if (setValue) {
        setValue(syntheticEvent);
      }
    }
  };
  return <div onPaste={handlePaste}>{children}</div>;
};
