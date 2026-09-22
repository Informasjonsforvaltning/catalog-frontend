import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

enum ProductStatusColors {
  PRODUCT_CONCEPT = "neutral",
  DEVELOPMENT = "info",
  PROTOTYPE = "second",
  MVP = "warning",
  TESTING = "third",
  PRODUCTION = "success",
  PHASED_OUT = "danger",
}

export type StatusKey = keyof typeof ProductStatusColors;

export type ProductStatusTagProps = {
  statusKey: StatusKey | undefined;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey
    ? ProductStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
    : "neutral";

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
