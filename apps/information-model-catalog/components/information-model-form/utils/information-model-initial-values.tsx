import {
  InformationModel,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";
import { omitBy, isEmpty } from "lodash";

export const informationModelTemplate = (
  informationModel: InformationModel,
): InformationModel => {
  return {
    ...informationModel,
    title: omitBy(informationModel?.title, isEmpty),
    description: omitBy(informationModel?.description, isEmpty),
  };
};

export const informationModelToBeCreatedTemplate =
  (): InformationModelToBeCreated => {
    return {
      title: {},
      description: {},
    };
  };
