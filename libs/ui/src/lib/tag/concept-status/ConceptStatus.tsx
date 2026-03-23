import {
  Tag as DSTag,
  type TagProps as DSTagProps,
} from "@digdir/designsystemet-react";
import { forwardRef } from "react";

enum ConceptStatusColors {
  DRAFT = "warning",
  CANDIDATE = "info",
  WAITING = "neutral",
  CURRENT = "success",
  RETIRED = "third",
  REJECTED = "danger",
}

export type StatusKey = keyof typeof ConceptStatusColors;

export type ConceptStatusTagProps = {
  statusKey: StatusKey | undefined;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey
    ? ConceptStatusColors[statusKey.toLocaleUpperCase() as StatusKey]
    : "neutral";

export const ConceptStatusTag = forwardRef<
  HTMLSpanElement,
  ConceptStatusTagProps
>(
  (
    { children, statusKey, statusLabel, ...rest }: ConceptStatusTagProps,
    ref,
  ) => {
    return (
      <DSTag ref={ref} data-color={getColorFromStatusKey(statusKey)} {...rest}>
        {statusLabel}
      </DSTag>
    );
  },
);

ConceptStatusTag.displayName = "ConceptStatusTag";
