import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/designsystemet-react';
import { forwardRef } from 'react';

enum ConceptStatusColors {
  DRAFT = 'second',
  CANDIDATE = 'info',
  WAITING = 'neutral',
  CURRENT = 'success',
  RETIRED = 'danger',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  REJECTED = 'neutral',
}

export type StatusKey = keyof typeof ConceptStatusColors;

export type ConceptStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey ? ConceptStatusColors[statusKey.toLocaleUpperCase() as StatusKey] : 'neutral';

export const ConceptStatusTag = forwardRef<HTMLSpanElement, ConceptStatusTagProps>(
  ({ children, statusKey, statusLabel, size = 'medium', ...rest }: ConceptStatusTagProps, ref) => {
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
