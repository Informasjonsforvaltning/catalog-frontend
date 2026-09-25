import {
  InformationModel,
  InformationModelContactPoint,
  InformationModelToBeCreated,
} from "@catalog-frontend/types";
import { normalizeVersion } from "@catalog-frontend/utils";
import { omitBy, isEmpty } from "lodash";

const contactPointTemplate = (
  contactPoint?: InformationModelContactPoint | null,
): InformationModelContactPoint => ({
  name: omitBy(contactPoint?.name, isEmpty),
  email: contactPoint?.email || undefined,
  telephone: contactPoint?.telephone || undefined,
  url: contactPoint?.url || undefined,
});

export const informationModelTemplate = (
  informationModel: InformationModel,
): InformationModel => {
  return {
    ...informationModel,
    title: omitBy(informationModel?.title, isEmpty),
    description: omitBy(informationModel?.description, isEmpty),
    contactPoints: [contactPointTemplate(informationModel?.contactPoints?.[0])],
    status: informationModel?.status || "",
    version: normalizeVersion(informationModel?.version),
  };
};

export const informationModelToBeCreatedTemplate =
  (): InformationModelToBeCreated => {
    return {
      title: {},
      description: {},
      contactPoints: [contactPointTemplate()],
      status: "",
      version: null,
    };
  };
