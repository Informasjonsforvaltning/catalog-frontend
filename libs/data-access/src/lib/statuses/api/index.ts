import { ReferenceDataCode } from "@catalog-frontend/types";

export const getAdmsStatuses = async (): Promise<{
  statuses: ReferenceDataCode[];
}> => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/adms/statuses`;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  const response = await fetch(path, options);
  return response.json();
};

export const getConceptStatuses = async (): Promise<{
  conceptStatuses: ReferenceDataCode[];
}> => {
  const path = `${process.env.FDK_BASE_URI}/reference-data/eu/concept-statuses`;
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
