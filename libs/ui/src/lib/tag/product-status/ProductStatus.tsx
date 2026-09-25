import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

export type StatusKey = string;

export type ProductStatusTagProps = {
  statusKey: StatusKey | undefined;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) => {
  switch (statusKey?.toLocaleUpperCase()) {
    case "PRODUCTION":
      return "success";
    case "PHASED_OUT":
      return "danger";
    default:
      return "info";
  }
};

export const ProductStatusTag = forwardRef<
  HTMLSpanElement,
  ProductStatusTagProps
>(
  (
    { children, statusKey, statusLabel, ...rest }: ProductStatusTagProps,
    ref,
  ) => {
    return (
      <DSTag ref={ref} data-color={getColorFromStatusKey(statusKey)} {...rest}>
        {statusLabel}
      </DSTag>
    );
  },
);

ProductStatusTag.displayName = "ProductStatusTag";
