import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/design-system-react';

enum ConceptStatusColors {
  DRAFT = 'second',
  CANDIDATE = 'info',
  WAITING = 'neutral',
  CURRENT = 'success',
  RETIRED = 'danger',
  REJECTED = 'neutral',
}

export type StatusKey = keyof typeof ConceptStatusColors;

export type ConceptStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey ? ConceptStatusColors[statusKey.toLocaleUpperCase() as StatusKey] : 'neutral';

export const ConceptStatusTag = ({
  children,
  statusKey,
  statusLabel,
  size = 'medium',
  ...rest
}: ConceptStatusTagProps) => {
  return (
    <DSTag
      color={getColorFromStatusKey(statusKey)}
      size={size}
      {...rest}
    >
      {statusLabel}
    </DSTag>
  );
};

ConceptStatusTag.displayName = '';
