import { useMutation } from "@tanstack/react-query";
import { validOrganizationNumber } from "@catalog-frontend/utils";
import { importInformationModel } from "@catalog-frontend/data-access";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useImport = (catalogId: string, contentType: string) => {
  const { data: session } = useSession();
  const router = useRouter();
  const accessToken = session?.accessToken ?? "";

  return useMutation({
    mutationFn: async (fileContent: string) => {
      if (!validOrganizationNumber(catalogId)) {
        return Promise.reject("Invalid organization number");
      }

      const location = await importInformationModel(
        fileContent,
        contentType,
        catalogId,
        accessToken,
      );

      if (location) {
        router.push(
          `/catalogs/${catalogId}/information-models/import-results/${location.split("/").pop()}`,
        );
      }
    },
  });
};
