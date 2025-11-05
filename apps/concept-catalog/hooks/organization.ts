import { getOrganization } from "@catalog-frontend/data-access";
import { validOrganizationNumber } from "@catalog-frontend/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetOrganization = (organizationId: string) => {
  return useQuery({
    queryKey: ["getOrganization", organizationId],

    queryFn: async () => {
      if (!validOrganizationNumber(organizationId)) {
        return Promise.reject("Invalid organization number");
      }

      const response = await getOrganization(organizationId);
      return response.json();
    },
  });
};
