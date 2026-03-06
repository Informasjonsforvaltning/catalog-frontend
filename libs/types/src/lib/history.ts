import { JsonPatchOperation } from "./json-patch";
import { AssignedUser } from "./user";

export interface HistoryPagination {
  totalPages: number;
  currentPage: number;
  size: number;
  totalElements: number;
}

export interface UpdateList {
  updates: Update[];
  pagination?: HistoryPagination;
}

export interface Update {
  id: string;
  resourceId: string;
  person: AssignedUser;
  datetime: string;
  operations: JsonPatchOperation[];
}
