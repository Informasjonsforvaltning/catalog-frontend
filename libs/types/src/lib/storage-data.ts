export type StorageData = {
  id?: string;
  values: any;
  lastChanged: string;
};

export type ConceptPageSettings = {
  page: number | null;
  search: string | null;
  searchField: string | null;
  sort: string | null;
  filter: {
    status: string[] | null;
    pubState: string[] | null;
    assignedUser: string | null;
    internalFields: Record<string, string[]> | null;
    label: string[] | null;
    subject: string[] | null;
  };
};
