import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/design-system-react';

export enum ChangeRequestStatusColors {
  OPEN = 'warning',
  REJECTED = 'danger',
  ACCEPTED = 'success',
}

export type StatusKey = keyof typeof ChangeRequestStatusColors;

export type ChangeRequestStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey ? ChangeRequestStatusColors[statusKey.toLocaleUpperCase() as StatusKey] : 'neutral';

export const ChangeRequestStatusTag = ({
  children,
  statusKey,
  statusLabel,
  size = 'medium',
  ...rest
}: ChangeRequestStatusTagProps) => {
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

ChangeRequestStatusTag.displayName = '';
