import { LocalizedStrings } from './localization';

export interface DataService {
  id: string;
  title: LocalizedStrings;
  description: LocalizedStrings;
  modified: string;
  status: string;
  organizationId: string;
}
