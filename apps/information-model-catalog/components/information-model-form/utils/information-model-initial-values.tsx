import {
  InformationModel,
  InformationModelContactPoint,
  InformationModelToBeCreated,
  ModelDocument,
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

export const modelDocumentTemplate = (
  document?: ModelDocument | null,
): ModelDocument => ({
  title: omitBy(document?.title, isEmpty),
  language: document?.language || "",
  format: document?.format || "",
  seeAlso: document?.seeAlso || "",
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
    homepage: informationModel?.homepage || "",
    version: normalizeVersion(informationModel?.version),
    creator: informationModel?.creator || "",
    subjects: informationModel?.subjects || [],
    relations: informationModel?.relations || [],
    hasFormat: (informationModel?.hasFormat ?? []).map(modelDocumentTemplate),
    issued: informationModel?.issued || "",
    modified: informationModel?.modified || "",
  };
};

export const informationModelToBeCreatedTemplate =
  (): InformationModelToBeCreated => {
    return {
      title: {},
      description: {},
      contactPoints: [contactPointTemplate()],
      status: "",
      homepage: "",
      version: null,
      creator: "",
      subjects: [],
      relations: [],
      hasFormat: [],
      issued: "",
      modified: "",
    };
  };
