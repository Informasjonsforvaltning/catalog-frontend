import { ReferenceDataCode } from '@catalog-frontend/types';

export const prepareStatusList = (conceptStatuses: ReferenceDataCode[]) => {
  const rejected = {
    uri: 'internal codes - REJECTED',
    code: 'REJECTED',
    label: {
      en: 'rejected',
      nb: 'avvist',
      nn: 'avvist',
    },
  } as ReferenceDataCode;

  const editedStatuses = conceptStatuses.map((code) => {
    if (code.code === 'WAITING') {
      code.label = {
        en: 'waiting',
        nb: 'til godkjenning',
        nn: 'til godkjenning',
      };
    }
    return code;
  });
  editedStatuses.push(rejected);

  const utilizedCodes: ReferenceDataCode[] = [];

  ['DRAFT', 'CANDIDATE', 'WAITING', 'CURRENT', 'RETIRED', 'REJECTED'].forEach((code) => {
    const utilized = editedStatuses.find((status) => status.code === code);
    if (utilized) utilizedCodes.push(utilized);
  });

  return utilizedCodes;
};
