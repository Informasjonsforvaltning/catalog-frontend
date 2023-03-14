const env =
  typeof window !== 'undefined'
    ? (window as any).env
    : {
        // use docker
        CONCEPT_REGISTRATION_API: 'http://localhost:8201',
        REGISTRATION_HOST: 'http://localhost:8098',
        SSO_HOST: 'http://localhost:8084',
        ORGANIZATION_API: 'http://localhost:8140',
      };

// use staging
// env.REGISTRATION_HOST =
//   'https://registrering.staging.fellesdatakatalog.digdir.no';
// env.CONCEPT_REGISTRATION_API =
//   'https://registrering-begrep-api.staging.fellesdatakatalog.digdir.no';
// env.SSO_HOST = 'https://sso.staging.fellesdatakatalog.digdir.no';
// env.ORGANIZATION_API =
//   'https://organization-catalog.staging.fellesdatakatalog.digdir.no';
// env.CONCEPT_API = 'https://www.staging.fellesdatakatalog.digdir.no';
// env.SEARCH_FULLTEXT_HOST = 'https://search.staging.fellesdatakatalog.digdir.no';
// env.SEARCH_HOST = 'https://www.staging.fellesdatakatalog.digdir.no';
// env.ADMIN_GUI_HOST = 'https://admin.staging.fellesdatakatalog.digdir.no';
// env.CATALOG_COMMENTS_SERVICE_HOST =
//   'https://catalog-comments.staging.fellesdatakatalog.digdir.no';
// env.USE_DEMO_LOGO = false;

const config =
  typeof window === 'undefined'
    ? {
        auth: {
          oidcIssuer: `${env.SSO_HOST}/auth/realms/fdk`,
          oidcClientId: 'concept-catalog-gui',
        },

        // frontend hosts
        registrationHost:
          env.REGISTRATION_HOST ||
          'https://registrering.fellesdatakatalog.digdir.no',

        // api modules
        conceptCatalogApi: {
          host:
            env.CONCEPT_REGISTRATION_API ||
            'https://begrep-registrering.fellesdatakatalog.digdir.no',
        },
        organizationApi: {
          host: env.ORGANIZATION_API || '',
        },

        conceptApi: {
          host: env.CONCEPT_API || 'https://fellesdatakatalog.digdir.no',
        },
        searchFullTextApi: {
          host: env.SEARCH_FULLTEXT_HOST,
        },
        searchHost: env.SEARCH_HOST || 'https://fellesdatakatalog.digdir.no',
        adminGui: {
          host: env.ADMIN_GUI_HOST,
        },
        commentsApi: {
          host: env.CATALOG_COMMENTS_SERVICE_HOST,
        },
        useDemoLogo: env.USE_DEMO_LOGO,
      }
    : {};

export const getConceptConfig = () => config;
