import { Service, ServiceToBeCreated } from '../../../../libs/types/src';

export const SERVICE_1: Service = {
  id: null,
  catalogId: null,
  published: false,
  title: {
    nb: 'Test service 1 nb',
    nn: 'Test service 1 nn',
    en: 'Test service 1 en',
  },
  description: {
    nb: 'This is a test service 1 nb',
    nn: 'This is a test service 1 nn',
    en: 'This is a test service 1 en',
  },
  produces: [
    {
      identifier: 'result1a',
      title: {
        nb: 'Service result 1a nb',
        nn: 'Service result 1a nn',
        en: 'Service result 1a en',
      },
      description: {
        nb: 'This is service result 1a produced by service 1 nb',
        nn: 'This is service result 1a produced by service 1 nn',
        en: 'This is service result 1a produced by service 1 en',
      },
    },
    {
      identifier: 'result1b',
      title: {
        nb: 'Service result 1b nb',
        nn: 'Service result 1b nn',
        en: 'Service result 1b en',
      },
      description: {
        nb: 'This is service result 1b produced by service 1 nb',
        nn: 'This is service result 1b produced by service 1 nn',
        en: 'This is service result 1b produced by service 1 en',
      },
    },
  ],
  contactPoints: [
    {
      category: {
        nb: 'Category contact point service 1 nb',
        nn: 'Category contact point service 1 nn',
        en: 'Category contact point service 1 en',
      },
      email: 'test1@example.com',
      telephone: '123456789',
      contactPage: 'https://test1.contactpage.com',
    },
  ],
  homepage: 'https://example1.com',
  status: 'http://purl.org/adms/status/Completed',
};

export const SERVICE_2: Service = {
  id: null,
  catalogId: null,
  published: false,
  title: {
    nb: 'Test service 2 nb',
    nn: 'Test service 2 nn',
    en: 'Test service 2 en',
  },
  description: {
    nb: 'This is a test service 2 nb',
    nn: 'This is a test service 2 nn',
    en: 'This is a test service 2 en',
  },
  produces: [
    {
      identifier: 'result2a',
      title: {
        nb: 'Service result 2a nb',
        nn: 'Service result 2a nn',
        en: 'Service result 2a en',
      },
      description: {
        nb: 'This is service result 2a produced by service 2 nb',
        nn: 'This is service result 2a produced by service 2 nn',
        en: 'This is service result 2a produced by service 2 en',
      },
    },
    {
      identifier: 'result2b',
      title: {
        nb: 'Service result 2b nb',
        nn: 'Service result 2b nn',
        en: 'Service result 2b en',
      },
      description: {
        nb: 'This is service result 2b produced by service 2 nb',
        nn: 'This is service result 2b produced by service 2 nn',
        en: 'This is service result 2b produced by service 2 en',
      },
    },
  ],
  contactPoints: [
    {
      category: {
        nb: 'Category contact point service 2 nb',
        nn: 'Category contact point service 2 nn',
        en: 'Category contact point service 2 en',
      },
      email: 'test2@example.com',
      telephone: '987654321',
      contactPage: 'https://test2.contactpage.com',
    },
  ],
  homepage: 'https://example2.com',
  status: 'http://purl.org/adms/status/Deprecated',
};

export const SERVICE_3: Service = {
  id: null,
  catalogId: null,
  published: false,
  title: {
    nb: 'Test service 3 nb',
    nn: 'Test service 3 nn',
    en: 'Test service 3 en',
  },
  description: {
    nb: 'This is a test service 3 nb',
    nn: 'This is a test service 3 nn',
    en: 'This is a test service 3 en',
  },
  produces: [
    {
      identifier: 'result3a',
      title: {
        nb: 'Service result 3a nb',
        nn: 'Service result 3a nn',
        en: 'Service result 3a en',
      },
      description: {
        nb: 'This is service result 3a produced by service 3 nb',
        nn: 'This is service result 3a produced by service 3 nn',
        en: 'This is service result 3a produced by service 3 en',
      },
    },
    {
      identifier: 'result3b',
      title: {
        nb: 'Service result 3b nb',
        nn: 'Service result 3b nn',
        en: 'Service result 3b en',
      },
      description: {
        nb: 'This is service result 3b produced by service 3 nb',
        nn: 'This is service result 3b produced by service 3 nn',
        en: 'This is service result 3b produced by service 3 en',
      },
    },
  ],
  contactPoints: [
    {
      category: {
        nb: 'Category contact point service 3 nb',
        nn: 'Category contact point service 3 nn',
        en: 'Category contact point service 3 en',
      },
      email: 'test3@example.com',
      telephone: '123987456',
      contactPage: 'https://test3.contactpage.com',
    },
  ],
  homepage: 'https://example3.com',
  status: 'http://purl.org/adms/status/Withdrawn',
};

export const ALL_SERVICES = [SERVICE_1, SERVICE_2, SERVICE_3];
