import { MultiLanguageText } from './language';

export interface CodeListsResult {
  codeLists: CodeList[];
}

export interface CodeList extends CodeListToBeCreated {
  id: string;
  catalogId: string;
}

export interface CodeListToBeCreated {
  name: string;
  description: string;
  catalogId?: string;
  codes?: Code[];
}

export interface Code {
  id: number;
  name: MultiLanguageText;
  parentID: number | null;
}

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}
