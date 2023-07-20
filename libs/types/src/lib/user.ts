export interface User {
  userId?: string; // used in catalog admin
  id?: string; // used in tildelt bruker
  catalogId?: string;
  name?: string;
  email?: string;
  telephoneNumber?: number;
}
