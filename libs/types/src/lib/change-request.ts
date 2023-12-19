import { JsonPatchOperation } from './json-patch';
import { UserName } from './user';

export type ChangeRequestStatus = 'OPEN' | 'REJECTED' | 'ACCEPTED';

export interface ChangeRequest {
  id: string | null;
  conceptId?: string | null;
  catalogId: string;
  status: ChangeRequestStatus;
  operations: JsonPatchOperation[];
  proposedBy?: UserName;
  timeForProposal?: string;
  title: string;
}

export interface ChangeRequestUpdateBody {
  conceptId: string | null;
  operations: JsonPatchOperation[];
  title: string;
}
