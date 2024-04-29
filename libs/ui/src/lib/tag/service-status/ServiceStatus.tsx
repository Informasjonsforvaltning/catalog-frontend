import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/designsystemet-react';
import { forwardRef } from 'react';

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

export const ServiceStatusTag = forwardRef<HTMLSpanElement, ServiceStatusTagProps>(
  ({ children, statusKey, statusLabel, size = 'medium', ...rest }: ServiceStatusTagProps, ref) => {
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
