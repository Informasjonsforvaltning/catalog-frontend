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

//TODO: move to more generic place
export interface MultiLanguageText {
  nb?: any;
  nn?: any;
  en?: any;
}
