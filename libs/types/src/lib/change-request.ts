import { JsonPatchOperation } from './history';

type ChangeRequestStatus = 'open' | 'rejected' | 'accepted';

export interface ChangeRequest {
  id: string;
  conceptId: string;
  catalogId: string;
  status: ChangeRequestStatus;
  operations: JsonPatchOperation[];
}
