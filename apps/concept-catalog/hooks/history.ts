import { validOrganizationNumber, validUUID } from "@catalog-frontend/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetHistory = ({ catalogId, resourceId, page = 1 }: any) => {
  return useQuery({
    queryKey: ["getHistory", resourceId, page],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject("Invalid catalog id");
      }

      if (!validUUID(resourceId)) {
        return Promise.reject("Invalid resource id");
      }

      if (!(Number.isInteger(page) && page > 0)) {
        return Promise.reject("Page must be a positive integer");
      }

      const response = await fetch(
        `/api/history/${catalogId}/${resourceId}?size=10&page=${page}`,
        {
          method: "GET",
        },
      );

      if (response.status === 401) {
        return Promise.reject("Unauthorized");
      }

      return response.json();
    },
  });
};
