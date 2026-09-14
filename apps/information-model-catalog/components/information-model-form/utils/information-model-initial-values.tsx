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
  };
};

export const informationModelToBeCreatedTemplate =
  (): InformationModelToBeCreated => {
    return {
      title: {},
    };
  };
