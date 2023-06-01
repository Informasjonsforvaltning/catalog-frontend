import { User } from "./user";

export interface JsonPatchOperation {
  op: string;
  path: string;
  value: string;
}

export interface UpdateList {
  updates: Update[];
}

export interface Update {
  id: string;
  resourceId: string;
  person: User;
  dateTime: string;
  operations: JsonPatchOperation[];
}
