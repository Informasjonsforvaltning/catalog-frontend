import {
  ContactPoint,
  Output,
  Service,
  ServiceToBeCreated,
} from "@catalog-frontend/types";

export const producesTemplate = (produce: Output): Output => {
  return {
    identifier: produce.identifier ?? 0,
    title: {
      nb: produce.title?.nb,
      nn: produce.title?.nn,
      en: produce.title?.en,
    },
    description: {
      nb: produce.description?.nb,
      nn: produce.description?.nn,
      en: produce.description?.en,
    },
  };
};

const emptyContactpoint: ContactPoint[] = [
  {
    category: { nb: undefined, nn: undefined, en: undefined },
    email: undefined,
    telephone: undefined,
    contactPage: undefined,
  },
];

export const emptyProduces: Output[] = [
  {
    identifier: "0",
    title: { nb: undefined, nn: undefined, en: undefined },
    description: { nb: undefined, nn: undefined, en: undefined },
  },
];

const contactPointTemplate = (
  contactPoint: ContactPoint,
): ContactPoint | null => {
  return {
    category: {
      nb: contactPoint.category?.nb,
      nn: contactPoint.category?.nn,
      en: contactPoint.category?.en,
    },
    email: contactPoint.email,
    telephone: contactPoint.telephone,
    contactPage: contactPoint.contactPage,
  };
};

export const serviceTemplate = (
  service: Service | undefined,
): ServiceToBeCreated => {
  const produces =
    service?.produces &&
    service.produces
      .map((produce) => producesTemplate(produce))
      .filter((cp) => cp !== null);
  const contactPoints = service?.contactPoints
    ? service.contactPoints
        .map((cp) => contactPointTemplate(cp))
        .filter((cp) => cp !== null)
    : emptyContactpoint;

  return {
    title: {
      nb: service?.title?.nb,
      nn: service?.title?.nn,
      en: service?.title?.en,
    },
    description: {
      nb: service?.description?.nb,
      nn: service?.description?.nn,
      en: service?.description?.en,
    },
    produces,
    contactPoints,
    homepage: service?.homepage,
    status: service?.status,
    spatial: service?.spatial || [],
    subject: service?.subject || [],
  };
};
