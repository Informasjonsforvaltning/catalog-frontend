import { User } from "./user";

export interface Comment {
  id: string;
  createdDate: string;
  lastChangedDate: string;
  topicId: string;
  orgNumber: string;
  user: User;
  comment: string;
}
