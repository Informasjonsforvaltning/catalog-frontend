import { AssignedUser, User } from './user';

export const mapUserToAssignedUser = (user: User): AssignedUser => {
  return {
    id: user.userId ?? '',
    catalogId: user.catalogId ?? '',
    name: user.name ?? '',
    email: user.email ?? '',
    telephoneNumber: user.telephoneNumber,
  };
};
