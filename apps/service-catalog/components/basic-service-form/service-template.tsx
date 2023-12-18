import { ContactPoint, Output, Service, ServiceToBeCreated } from '@catalog-frontend/types';

export const producesTemplate = (produce: Output): Output => {
  const identifier = produce.identifier || '0';
  const title = produce.title?.nb || '';
  const description = produce.description?.nb || '';

  return {
    identifier,
    title: { nb: title },
    description: { nb: description },
  };
};

const emptyContactpoint: ContactPoint[] = [
  {
    category: { nb: '' },
    email: '',
    telephone: '',
    contactPage: '',
  },
];

export const emptyProduces: Output[] = [
  {
    identifier: '0',
    title: { nb: '' },
    description: { nb: '' },
  },
];

const contactPointTemplate = (contactPoint: ContactPoint): ContactPoint | null => {
  if (contactPoint) {
    const category = contactPoint.category?.nb || '';
    const email = contactPoint.email || '';
    const telephone = contactPoint.telephone || '';
    const contactPage = contactPoint.contactPage || '';

    return {
      category: { nb: category },
      email,
      telephone,
      contactPage,
    };
  } else {
    return null;
  }
};

export const serviceTemplate = (service: Service | undefined): ServiceToBeCreated => {
  const title = (service && service.title?.nb) || '';
  const description = (service && service.description?.nb) || '';
  const homepage = (service && service.homepage) || '';
  const produces =
    service &&
    service.produces &&
    (service.produces.map((produce) => producesTemplate(produce as Output)).filter((cp) => cp !== null) as Output[]);

  const contactPoints =
    service && service.contactPoints
      ? (service.contactPoints
          .map((cp) => contactPointTemplate(cp as ContactPoint))
          .filter((cp) => cp !== null) as ContactPoint[])
      : emptyContactpoint;

  const status = (service && service.status) || '';
  return {
    title: { nb: title },
    description: { nb: description },
    produces,
    contactPoints,
    homepage,
    status,
  };
};
