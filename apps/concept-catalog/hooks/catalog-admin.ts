import { getCatalogDesign } from "@catalog-frontend/data-access";
import { Design } from "@catalog-frontend/types";
import { validOrganizationNumber } from "@catalog-frontend/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useGetCatalogDesign = (catalogId: string) => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? "";

  return useQuery<Design>({
    queryKey: ["getCatalogDesign", catalogId],
    queryFn: async () => {
      if (!validOrganizationNumber(catalogId)) {
        throw new Error("Invalid catalog ID");
      }

      const result = await getCatalogDesign(catalogId, accessToken);

      if (!result.ok) {
        throw new Error(
          result.status === 401
            ? "Unauthorized"
            : `Failed to get catalog design: ${result.status}`,
        );
      }

      return result.design;
    },
    enabled: !!accessToken && !!catalogId,
  });
};
