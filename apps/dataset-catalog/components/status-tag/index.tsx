import { localization } from '@catalog-frontend/utils';
import { Tag } from '@digdir/designsystemet-react';

enum StatusColors {
  DRAFT = 'second',
  PUBLISH = 'success',
  APPROVE = 'info',
}

export const StatusTag = ({
  datasetStatus,
  ...props
}: {
  datasetStatus: keyof typeof StatusColors;
  [key: string]: any;
}) => {
  return (
    <Tag
      size='sm'
      color={StatusColors[datasetStatus]}
      {...props}
    >
      {localization.datasetCatalog.status?.[datasetStatus]}
    </Tag>
  );
};

export default StatusTag;
