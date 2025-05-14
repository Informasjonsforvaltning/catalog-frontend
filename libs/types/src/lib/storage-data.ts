export type StorageData = {
  id?: string;
  values: any;
  lastChanged: string;
};

export type ConceptSearchPageSettings = {
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

export type ChangeRequestSearchPageSettings = {
  search: string | null;
  sort: string | null;
  filter: {
    status: string[] | null;
    itemType: string | null;
  }
};

export type DatasetSearchPageSettings = {
  search: string | null;
  sort: string | null;
  page: number | null;
  filter: {
    status: string[] | null;
    pubState: string[] | null;
  }
};
