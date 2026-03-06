import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

enum DataServiceStatusColors {
  DEVELOP = "second",
  COMPLETED = "success",
  WITHDRAWN = "danger",
  DEPRECATED = "info",
}

export type StatusKey = keyof typeof DataServiceStatusColors;

export type DataServiceStatusTagProps = {
  statusKey: StatusKey | undefined;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey
    ? DataServiceStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
    : "neutral";

export const DataServiceStatusTag = forwardRef<
  HTMLSpanElement,
  DataServiceStatusTagProps
>(
  (
    { children, statusKey, statusLabel, ...rest }: DataServiceStatusTagProps,
    ref,
  ) => {
    return (
      <DSTag ref={ref} data-color={getColorFromStatusKey(statusKey)} {...rest}>
        {statusLabel}
      </DSTag>
    );
  },
);

DataServiceStatusTag.displayName = "DataServiceStatusTag";
