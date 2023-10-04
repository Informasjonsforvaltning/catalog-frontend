import { JsonPatchOperation } from './json-patch';

type ChangeRequestStatus = 'OPEN' | 'REJECTED' | 'ACCEPTED';

export interface ChangeRequest {
  id: string;
  conceptId?: string;
  catalogId: string;
  status: ChangeRequestStatus;
  operations: JsonPatchOperation[];
}
