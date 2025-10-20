import { ContactPoint, Output, Service, ServiceToBeCreated } from '@catalog-frontend/types';

export const producesTemplate = (produce: Output): Output => {
  const identifier = produce.identifier ?? '0';

  return {
    identifier,
    title: { nb: produce.title?.nb ?? '', nn: produce.title?.nn ?? '', en: produce.title?.en ?? '' },
    description: {
      nb: produce.description?.nb ?? '',
      nn: produce.description?.nn ?? '',
      en: produce.description?.en ?? '',
    },
  };
};

const emptyContactpoint: ContactPoint[] = [
  {
    category: { nb: '', nn: '', en: '' },
    email: '',
    telephone: '',
    contactPage: '',
  },
];

export const emptyProduces: Output[] = [
  {
    identifier: '0',
    title: { nb: '', nn: '', en: '' },
    description: { nb: '', nn: '', en: '' },
  },
];

const contactPointTemplate = (contactPoint: ContactPoint): ContactPoint | null => {
  if (contactPoint) {
    const email = contactPoint.email ?? '';
    const telephone = contactPoint.telephone ?? '';
    const contactPage = contactPoint.contactPage ?? '';

    return {
      category: {
        nb: contactPoint.category?.nb ?? '',
        nn: contactPoint.category?.nn ?? '',
        en: contactPoint.category?.en ?? '',
      },
      email,
      telephone,
      contactPage,
    };
  } else {
    return null;
  }
};

export const serviceTemplate = (service: Service | undefined): ServiceToBeCreated => {
  const homepage = (service && service.homepage) ?? '';
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
  return {
    title: {
      nb: (service && service.title?.nb) ?? '',
      nn: (service && service.title?.nn) ?? '',
      en: (service && service.title?.en) ?? '',
    },
    description: {
      nb: (service && service.description?.nb) ?? '',
      nn: (service && service.description?.nn) ?? '',
      en: (service && service.description?.en) ?? '',
    },
    produces,
    contactPoints,
    homepage,
    status: (service && service.status) ?? '',
  };
};
