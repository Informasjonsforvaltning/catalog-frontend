export interface UserName {
  id?: string;
  name?: string;
  email?: string;
}

export interface AssignedUser extends UserName {
  catalogId?: string;
  telephoneNumber?: string;
}

export interface UsersResult {
  users: AssignedUser[];
}
