import { LocalizedStrings } from "./localization";

export interface InformationModel extends InformationModelToBeCreated {
  id: string;
  catalogId: string;
  published: boolean;
  publishedDate: string;
  uri: string;
}

export interface InformationModelToBeCreated {
  title: LocalizedStrings;
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
