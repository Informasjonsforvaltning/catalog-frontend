export interface AssignedUser {
  id?: string;
  catalogId?: string;
  name?: string;
  email?: string;
  telephoneNumber?: string;
}

export interface UsersResult {
  users: AssignedUser[];
}
