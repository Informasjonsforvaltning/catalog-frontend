interface UserBase {
  catalogId?: string;
  name?: string;
  email?: string;
  telephoneNumber?: number;
}

export interface AssignedUser extends UserBase {
  id: string;
}

export interface User extends UserBase {
  userId?: string;
}
