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
  id: string;
  name: MultiLanguageText;
  parentID: string | null;
}

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}
