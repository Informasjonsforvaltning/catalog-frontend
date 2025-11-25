"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import type { DataService, StorageData } from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import DataServiceForm from "../../../../../../components/data-service-form";
import { updateDataService } from "../../../../../../app/actions/actions";

type EditPageProps = {
  catalogId: string;
  dataService: DataService;
  searchEnv: string;
  referenceData: any;
  referenceDataEnv: string;
};

export const EditPage = ({
  catalogId,
  dataService,
  searchEnv,
  referenceData,
  referenceDataEnv,
}: EditPageProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "dataServiceForm",
  });

  const handleUpdate = async (values: DataService) => {
    return updateDataService(catalogId, dataService, values);
  };

  const handleCancel = () => {
    window.location.replace(
      `/catalogs/${catalogId}/data-services/${dataService.id}`,
    );
  };

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${catalogId}/data-services`);
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
      <DataServiceForm
        initialValues={dataService}
        searchEnv={searchEnv}
        referenceData={referenceData}
        referenceDataEnv={referenceDataEnv}
        autoSaveStorage={dataStorage}
        autoSaveId={dataService.id}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        showSnackbarSuccessOnInit={showSnackbar}
      />
    </>
  );
};
