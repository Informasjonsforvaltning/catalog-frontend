import { AssignedUser } from './user';

export interface Comment {
  id: string;
  createdDate: string;
  lastChangedDate: string;
  topicId: string;
  orgNumber: string;
  user?: AssignedUser | null;
  comment: string;
}
