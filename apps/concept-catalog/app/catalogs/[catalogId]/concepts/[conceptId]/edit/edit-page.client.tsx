"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import type { Concept, StorageData } from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import ConceptForm from "@concept-catalog/components/concept-form";
import { updateConcept } from "@concept-catalog/app/actions/concept/actions";

export const EditPage = ({
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  hasChangeRequests,
}: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [autoSave, setAutoSave] = useState(hasChangeRequests ? false : true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "conceptForm",
    secondaryKeys: {
      definition: "conceptFormDefinition",
      relation: "conceptFormRelation",
    },
  });

  const handleUpdate = async (values: Concept) => {
    return await updateConcept(concept, values, fieldsResult.internal);
  };

  const handleSuccess = () => {
    setAutoSave(true);
  };

  const handleCancel = () => {
    window.location.replace(`/catalogs/${catalogId}/concepts/${concept.id}`);
  };

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${catalogId}/concepts`);
  };

  useEffect(() => {
    if (searchParams.get("created") === "true") {
      setShowSnackbar(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("created");

      const newUrl =
        newParams.toString().length > 0
          ? `${pathname}?${newParams.toString()}`
          : pathname;

      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams, pathname]);

  function handleRestore(data: StorageData): boolean {
    if (data?.id !== concept.id) {
      if (!data?.id) {
        window.location.replace(
          `/catalogs/${catalogId}/concepts/new?restore=1`,
        );
        return false;
      }
      window.location.replace(
        `/catalogs/${catalogId}/concepts/${data.id}/edit?restore=1`,
      );
      return false;
    }
    return true;
  }

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleGotoOverview}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      {hasChangeRequests ? (
        <ConfirmModal
          title={localization.changeRequest.changeRequest}
          content={localization.concept.confirmEditWithChangeRequest}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : undefined}
      <ButtonBar>
        <Button
          variant="tertiary"
          color="second"
          size="sm"
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize="1.25em" />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ConceptForm
        autoSave={autoSave}
        autoSaveId={concept.id}
        autoSaveStorage={dataStorage}
        catalogId={catalogId}
        initialConcept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        onRestore={handleRestore}
        showSnackbarSuccessOnInit={showSnackbar}
      />
    </>
  );
};
