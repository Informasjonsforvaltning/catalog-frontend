import { ReferenceDataCode } from '@catalog-frontend/types';

export const prepareStatusList = (conceptStatuses: ReferenceDataCode[]) => {
  const extraCodes = [
    {
      uri: 'internal codes - REJECTED',
      code: 'REJECTED',
      label: {
        en: 'rejected',
        nb: 'avvist',
        nn: 'avvist',
      },
    },
  ] as ReferenceDataCode[];

  return conceptStatuses.concat(extraCodes);
};
