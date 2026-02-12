import { DataService, DataServiceToBeCreated } from "@catalog-frontend/types";
import { omitBy, isEmpty } from "lodash";

export const dataServiceTemplate = (dataService: DataService): DataService => {
  return {
    ...dataService,
    title: omitBy(dataService?.title, isEmpty),
    description: omitBy(dataService?.description, isEmpty),
    keywords: omitBy(dataService?.keywords, isEmpty),
    version: dataService?.version ?? "",
    contactPoint: {
      ...dataService?.contactPoint,
      name: omitBy(dataService?.contactPoint?.name, isEmpty),
      email: dataService?.contactPoint?.email || undefined,
      phone: dataService?.contactPoint?.phone || undefined,
      url: dataService?.contactPoint?.url || undefined,
    },
  };
};

export const dataServiceToBeCreatedTemplate = (): DataServiceToBeCreated => {
  return {
    title: {},
    description: {},
    status: "",
    endpointUrl: "",
    endpointDescriptions: [],
    accessRights: "none",
    formats: [],
    keywords: {},
    version: "",
    landingPage: "",
    pages: [],
    license: "none",
    servesDataset: [],
    contactPoint: {},
    availability: "",
    costs: [],
  };
};
