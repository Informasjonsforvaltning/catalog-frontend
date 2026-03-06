"use client";
import { localization } from "@catalog-frontend/utils";
import { Button, DeleteButton } from "@catalog-frontend/ui-v2";
import { deletePublicService } from "../../app/actions/public-services/actions";
import { deleteService } from "../../app/actions/services/actions";

type DeleteProps = {
  catalogId: string;
  published: boolean;
  serviceId: string;
  type: "services" | "public-services";
};

export const DeleteServiceButton = ({
  catalogId,
  published,
  serviceId,
  type,
}: DeleteProps) => {
  const handleDelete = () => {
    if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
      type === "public-services"
        ? deletePublicService(catalogId, serviceId)
        : deleteService(catalogId, serviceId);
    }
  };

  return (
    <DeleteButton
      disabled={published}
      onClick={handleDelete}
      variant="secondary"
    />
  );
};
