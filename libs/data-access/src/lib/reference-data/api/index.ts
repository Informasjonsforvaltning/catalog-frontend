import {
  DataTheme,
  LosTheme,
  MobilityTheme,
  ReferenceDataCode,
} from "@catalog-frontend/types";
import {
  FindByUrIsRequestQueryVariables,
  SearchAlternative,
  SearchQueryVariables,
} from "../generated/graphql";

export const getDatasetTypes = async (): Promise<{
  datasetTypes: ReferenceDataCode[];
}> => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/eu/dataset-types`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(path, options);
  return response.json();
};

export const getDistributionStatuses = async (): Promise<{
  distributionStatuses: ReferenceDataCode[];
}> => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/eu/distribution-statuses`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    cache: "no-cache" as RequestCache,
  };
  const response = await fetch(path, options);
  return response.json();
};

export const getLosThemes = async (): Promise<{
  losNodes: LosTheme[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/los/themes-and-words`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getDataThemes = async (): Promise<{ dataThemes: DataTheme[] }> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/data-themes`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getMobilityThemes = async (): Promise<{
  mobilityThemes: MobilityTheme[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/mobility/themes`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getMobilityDataStandards = async (): Promise<{
  mobilityDataStandards: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/mobility/data-standards`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getMobilityRights = async (): Promise<{
  mobilityConditions: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/mobility/conditions-for-access-and-usage`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getFrequencies = async (): Promise<{
  frequencies: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/frequencies`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getOpenLicenses = async (): Promise<{
  openLicenses: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/open-licenses`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getProvenanceStatements = async (): Promise<{
  provenanceStatements: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/provenance-statements`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getPlannedAvailabilities = async (): Promise<{
  plannedAvailabilities: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/planned-availabilities`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const getCurrencies = async (): Promise<{
  currencies: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/eu/currencies`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};

export const searchReferenceData = async (
  searchQuery: string,
  envVariable: string,
  types: SearchAlternative[],
) => {
  const resource = `${envVariable}/reference-data/graphql`;

  const body = JSON.stringify({
    query: `
      query Search($req: SearchRequest!) {
        search(req: $req) {
          uri
          code
          label {
            nb
            en
            nn
            no
          }
          type
        }
      }
    `,
    variables: {
      req: {
        query: searchQuery,
        types: types,
      },
    } as SearchQueryVariables,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
  const res = await fetch(resource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.search;
  return data;
};

export const searchReferenceDataByUri = async (
  uriList: string[],
  envVariable: string,
  types: SearchAlternative[],
) => {
  const resource = `${envVariable}/reference-data/graphql`;

  const body = JSON.stringify({
    query: `
      query FindByURIsRequest($req: FindByURIsRequest!) {
        findByURIs(req: $req) {
          uri
          code
          label {
            nb
            en
            nn
            no
          }
          type
        }
      }
    `,
    variables: {
      req: {
        uris: uriList,
        types: types,
      },
    } as FindByUrIsRequestQueryVariables,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };

  const res = await fetch(resource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.findByURIs;

  return data;
};

export const getLanguages = async (): Promise<{
  linguisticSystems: ReferenceDataCode[];
}> => {
  const resource = `${process.env.FDK_BASE_URI}/reference-data/linguistic-systems`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(resource, options);
  return response.json();
};
