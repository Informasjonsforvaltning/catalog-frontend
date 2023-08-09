export interface AssignedUser {
  id?: string;
  catalogId?: string;
  name?: string;
  email?: string;
  telephoneNumber?: number;
}

export interface UsersResult {
  users: AssignedUser[];
}
