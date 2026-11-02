"use server";

import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  FindByUrIsRequestQueryVariables,
  SearchAlternative,
  SearchQueryVariables,
} from "../generated/graphql";

const graphqlResource = `${process.env.REFERENCE_DATA_BASE_URI}/reference-data/graphql`;

export const searchReferenceData = async (
  searchQuery: string,
  types: SearchAlternative[],
) => {
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
          subType
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
  const res = await fetch(graphqlResource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.search;
  return data;
};

export const searchReferenceDataByUri = async (
  uriList: string[],
  types: SearchAlternative[],
) => {
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
          subType
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

  const res = await fetch(graphqlResource, options);
  const json = await res.json();
  const data: ReferenceDataCode[] = json.data.findByURIs;

  return data;
};
