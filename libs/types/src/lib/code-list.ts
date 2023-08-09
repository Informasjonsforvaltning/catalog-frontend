import { MultiLanguageText } from './types';

export interface CodeListsResult {
  codeLists: CodeList[];
}

export interface CodeList {
  id?: string;
  name: string;
  catalogId?: string;
  description: string;
  codes?: Code[];
}

export interface Code {
  id: number;
  name: MultiLanguageText;
  parentID: number | null;
}
