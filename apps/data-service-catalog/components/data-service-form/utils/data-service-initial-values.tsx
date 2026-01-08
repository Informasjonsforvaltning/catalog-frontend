import { DataService, DataServiceToBeCreated } from "@catalog-frontend/types";
import { removeEmptyOrNullValues } from "@catalog-frontend/utils";

export const dataServiceTemplate = (dataService: DataService): DataService => {
  return {
    ...dataService,
    title: removeEmptyOrNullValues(dataService?.title),
    description: removeEmptyOrNullValues(dataService?.description),
    keywords: removeEmptyOrNullValues(dataService?.keywords),
    contactPoint: {
      ...dataService?.contactPoint,
      name: removeEmptyOrNullValues(dataService?.contactPoint?.name),
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
    modified: "",
    status: "",
    endpointUrl: "",
    endpointDescriptions: [],
    accessRights: "none",
    formats: [],
    keywords: {},
    landingPage: "",
    pages: [],
    license: "none",
    servesDataset: [],
    contactPoint: {},
    availability: "",
    costs: [],
  };
};
