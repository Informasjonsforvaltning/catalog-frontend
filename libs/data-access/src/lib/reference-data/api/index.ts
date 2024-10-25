import { ReferenceDataCode } from '@catalog-frontend/types';
import { FindByUrIsRequestQueryVariables, SearchAlternative, SearchQueryVariables } from '../generated/graphql';

export const getConceptStatuses = async () => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/eu/concept-statuses`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
    cache: 'no-cache' as RequestCache,
  };
  return await fetch(path, options);
};

export const getDatasetTypes = async () => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/eu/dataset-types`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(path, options);
};

export const getLosThemes = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/los/themes-and-words`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getDataThemes = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/data-themes`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getFrequencies = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/frequencies`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getOpenLicenses = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/open-licenses`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getProvenanceStatements = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/provenance-statements`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getFileTypes = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/file-types`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getMediaTypes = async () => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/iana/media-types`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  };
  return await fetch(resource, options);
};

export const getAdministrativeUnits = async (searchQuery: string, envVariable: string) => {
  const resource = `${envVariable}/reference-data/graphql`;

  const body = JSON.stringify({
    query: `
      query Search($req: SearchRequest!) {
        search(req: $req) {
          uri
          code
          label {
            nb
          }
          type
        }
      }
    `,
    variables: {
      req: {
        query: searchQuery,
        types: [SearchAlternative.AdministrativeEnheter],
      },
    } as SearchQueryVariables,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };
  const res = await fetch(resource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.search;
  return data;
};

export const getAdministrativeUnitsByUri = async (uriList: string[], envVariable: string) => {
  const resource = `${envVariable}/reference-data/graphql`;

  const body = JSON.stringify({
    query: `
      query FindByURIsRequest($req: FindByURIsRequest!) {
        findByURIs(req: $req) {
          uri
          code
          label {
            nb
          }
          type
        }
      }
    `,
    variables: {
      req: {
        uris: uriList,
        types: [SearchAlternative.AdministrativeEnheter],
      },
    } as FindByUrIsRequestQueryVariables,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  };

  const res = await fetch(resource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.findByURIs;

  return data;
};
