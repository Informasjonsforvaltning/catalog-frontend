"use client";

import { ImportResult } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import { deleteImportResult } from "../../../../../actions/actions";
import { ConfirmModal, ImportResultDetails } from "@catalog-frontend/ui";
import { useState } from "react";

interface Props {
  catalogId: string;
  importResult: ImportResult;
}

const ImportResultDetailsPageClient = ({ catalogId, importResult }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirmed = async () => {
    try {
      await deleteImportResult(catalogId, importResult.id);
      window.location.replace(
        `/catalogs/${catalogId}/data-services/import-results`,
      );
    } catch (error) {
      window.alert(error);
    }
  };

  const handleDeleteClick = async () => {
    setShowDeleteConfirm(true);
  };

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmModal
          title={localization.importResult.confirmDelete}
          content={
            importResult.status === "COMPLETED"
              ? localization.importResult.deleteCanResultInDuplicates
              : ""
          }
          onSuccess={handleDeleteConfirmed}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <ImportResultDetails
        targetBaseHref={`catalogs/${catalogId}/data-services`}
        importResult={importResult}
        deleteHandler={handleDeleteClick}
      />
    </>
  );
};

export default ImportResultDetailsPageClient;
