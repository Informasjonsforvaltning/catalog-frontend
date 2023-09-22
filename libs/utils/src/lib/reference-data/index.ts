import { ReferenceDataCode } from '@catalog-frontend/types';

export const prepareStatusList = (conceptStatuses: ReferenceDataCode[]) => {
  const utilizedCodes: ReferenceDataCode[] = [];

  const draft = conceptStatuses.find(code => code.code === 'DRAFT');
  if (draft) utilizedCodes.push(draft);

  const candidate = conceptStatuses.find(code => code.code === 'CANDIDATE');
  if (candidate) utilizedCodes.push(candidate);

  const waiting = conceptStatuses.find(code => code.code === 'WAITING');
  if (waiting) {
    waiting.label = {
      en: 'waiting',
      nb: 'til godkjenning',
      nn: 'til godkjenning'
    };
    utilizedCodes.push(waiting);
  }

  const current = conceptStatuses.find(code => code.code === 'CURRENT');
  if (current) utilizedCodes.push(current);

  const retired = conceptStatuses.find(code => code.code === 'RETIRED');
  if (retired) utilizedCodes.push(retired);

  const rejected = {
    uri: 'internal codes - REJECTED',
    code: 'REJECTED',
    label: {
      en: 'rejected',
      nb: 'avvist',
      nn: 'avvist'
    }
  } as ReferenceDataCode;
  utilizedCodes.push(rejected);

  return utilizedCodes;
};
