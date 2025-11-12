import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

export enum ChangeRequestStatusColors {
  OPEN = "warning",
  REJECTED = "danger",
  ACCEPTED = "success",
}

export type StatusKey = keyof typeof ChangeRequestStatusColors;

export type ChangeRequestStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey
    ? ChangeRequestStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
    : "neutral";

export const ChangeRequestStatusTag = forwardRef<
  HTMLSpanElement,
  ChangeRequestStatusTagProps
>(
  (
    {
      statusKey,
      statusLabel,
      size = "medium",
      ...rest
    }: ChangeRequestStatusTagProps,
    ref,
  ) => {
    return (
      <DSTag
        ref={ref}
        color={getColorFromStatusKey(statusKey)}
        size={size}
        {...rest}
      >
        {statusLabel}
      </DSTag>
    );
  },
);

ChangeRequestStatusTag.displayName = "ChangeRequestStatusTag";
