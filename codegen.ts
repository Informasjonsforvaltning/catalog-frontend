import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    // Service messages
    './libs/data-access/src/lib/strapi/generated/graphql.ts': {
      schema: 'https://cms.staging.fellesdatakatalog.digdir.no/graphql',
      documents: './libs/data-access/src/lib/strapi/graphql/service-message.graphql',
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        useTypeImports: true,
        skipTypename: false,
        addDocBlocks: true,
        defaultScalarType: 'unknown',
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          FancyArticleContentDynamicZoneInput: 'Record<string, any>',
          I18NLocaleCode: 'string',
          TransportArticleContentDynamicZoneInput: 'Record<string, any>',
        },
        fetcher: 'graphql-request',
        exposeQueryKeys: true,
        exposeFetcher: true,
        exposeMutationKeys: true,
        addInfiniteQuery: true,
      },
      plugins: ['typescript', 'typescript-operations', '@graphql-codegen/typescript-react-query'],
    },

    // Reference-data
    './libs/data-access/src/lib/reference-data/generated/graphql.ts': {
      schema:
        'https://raw.githubusercontent.com/Informasjonsforvaltning/fdk-reference-data/refs/heads/main/src/main/resources/graphql/schema.graphqls',
      documents: './libs/data-access/src/lib/reference-data/graphql/administrative-units.graphql',
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        useTypeImports: true,
        skipTypename: false,
        addDocBlocks: true,
        defaultScalarType: 'unknown',
        strictScalars: true,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
          FancyArticleContentDynamicZoneInput: 'Record<string, any>',
          I18NLocaleCode: 'string',
          TransportArticleContentDynamicZoneInput: 'Record<string, any>',
        },
        fetcher: 'graphql-request',
        exposeQueryKeys: true,
        exposeFetcher: true,
        exposeMutationKeys: true,
        addInfiniteQuery: true,
      },
      plugins: ['typescript', 'typescript-operations', '@graphql-codegen/typescript-react-query'],
    },
  },
};

export default config;
