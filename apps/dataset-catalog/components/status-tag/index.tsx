import { PublicationStatus } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { Tag } from '@digdir/designsystemet-react';

enum StatusColors {
  'DRAFT' = 'second',
  'APPROVE' = 'success',
}

export const StatusTag = ({ datasetStatus, ...props }: { datasetStatus: PublicationStatus }) => {
  const status: keyof typeof StatusColors =
    datasetStatus === PublicationStatus.PUBLISH ? PublicationStatus.APPROVE : datasetStatus;
  return (
    <Tag
      size='sm'
      color={StatusColors[status]}
      {...props}
    >
      {localization.datasetCatalog.status?.[status]}
    </Tag>
  );
};

export default StatusTag;
