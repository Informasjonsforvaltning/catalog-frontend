import { JsonPatchOperation } from './history';

type ChangeRequestStatus = 'OPEN' | 'REJECTED' | 'ACCEPTED';

export interface ChangeRequest {
  id: string;
  conceptId?: string;
  catalogId: string;
  status: ChangeRequestStatus;
  operations: JsonPatchOperation[];
}