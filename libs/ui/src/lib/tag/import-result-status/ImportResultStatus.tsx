import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

export enum ImportResultStatusColors {
  FAILED = "danger",
  SAVING_FAILED = "danger",
  COMPLETED = "success",
  PARTIALLY_COMPLETED = "third",
  IN_PROGRESS = "third",
  PENDING_CONFIRMATION = "warning",
  SAVING = "third",
  CANCELLING = "first",
  CANCELLED = "first",
}

export type StatusKey = keyof typeof ImportResultStatusColors;

export type ImportResultStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey
    ? ImportResultStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
    : "neutral";

export const ImportResultStatusTag = forwardRef<
  HTMLSpanElement,
  ImportResultStatusTagProps
>(
  (
    { children, statusKey, statusLabel, ...rest }: ImportResultStatusTagProps,
    ref,
  ) => {
    return (
      <DSTag ref={ref} data-color={getColorFromStatusKey(statusKey)} {...rest}>
        {statusLabel}
      </DSTag>
    );
  },
);

ImportResultStatusTag.displayName = "ImportResultStatusTag";
