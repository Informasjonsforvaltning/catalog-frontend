import { JsonPatchOperation } from './json-patch';
import { AssignedUser } from './user';

export interface UpdateList {
  updates: Update[];
}

export interface Update {
  id: string;
  resourceId: string;
  person: AssignedUser;
  datetime: string;
  operations: JsonPatchOperation[];
}
