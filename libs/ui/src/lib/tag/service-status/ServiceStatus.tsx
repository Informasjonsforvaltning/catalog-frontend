import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/design-system-react';

export enum ServiceStatusColors {
  COMPLETED = 'success',
  DEPRECATED = 'second',
  UNDERDEVELOPMENT = 'info',
  WITHDRAWN = 'danger',
}

export type StatusKey = keyof typeof ServiceStatusColors;

export type ServiceStatusTagProps = {
  statusKey: StatusKey;
  statusLabel: string;
} & DSTagProps;

const getColorFromStatusKey = (statusKey: StatusKey | undefined) =>
  statusKey ? ServiceStatusColors[statusKey.toLocaleUpperCase() as StatusKey] : 'neutral';

export const ServiceStatusTag = ({
  children,
  statusKey,
  statusLabel,
  size = 'medium',
  ...rest
}: ServiceStatusTagProps) => {
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

ServiceStatusTag.displayName = '';
