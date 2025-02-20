import { DataServiceStatusTagProps, Tag } from '@catalog-frontend/ui';
import { getTranslateText } from '@catalog-frontend/utils';
import React from 'react';
import { ReferenceDataCode } from '@catalog-frontend/types';

export const StatusTag = ({
  dataServiceStatus,
  distributionStatuses,
  language,
}: {
  dataServiceStatus?: string;
  distributionStatuses: ReferenceDataCode[];
  language: string;
}) => {
  const findDistributionStatus = (statusURI) => distributionStatuses?.find((s) => s.uri === statusURI);
  return dataServiceStatus ? (
    <Tag.DataServiceStatus
      statusKey={findDistributionStatus(dataServiceStatus)?.code as DataServiceStatusTagProps['statusKey']}
      statusLabel={getTranslateText(findDistributionStatus(dataServiceStatus)?.label, language) as string}
    />
  ) : (
    <></>
  );
};

export default StatusTag;
