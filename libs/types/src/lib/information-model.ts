import { LocalizedStrings } from "./localization";

export interface InformationModelContactPoint {
  name?: LocalizedStrings;
  email?: string;
  telephone?: string;
  url?: string;
}

export interface InformationModel extends InformationModelToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
  publishedDate?: string | null;
  created?: string;
  lastModified?: string | null;
  uri?: string | null;
}

export interface InformationModelToBeCreated {
  title: LocalizedStrings;
  description?: LocalizedStrings | null;
  contactPoints?: InformationModelContactPoint[] | null;
  status?: string | null;
  homepage?: string | null;
}

export type InformationModelsPageSettings = {
  search: string | null;
  sort: string | null;
  page: number | null;
  filter: {
    status: string[] | null;
    pubState: string[] | null;
  };
};
