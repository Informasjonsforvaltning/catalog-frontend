import { localization } from '@catalog-frontend/utils';
import { Tag } from '@digdir/designsystemet-react';

type StatusTagProps = {
  approved: boolean;
};

export const StatusTag = ({ approved, ...props }: StatusTagProps) => {
  return (
    <Tag
      size='sm'
      color={approved ? 'success' : 'second'}
      {...props}
    >
      {localization.datasetCatalog.status?.[approved ? 'ARRPOVE' : 'DRAFT']}
    </Tag>
  );
};

export default StatusTag;
