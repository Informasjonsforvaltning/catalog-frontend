"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import type {
  InformationModel,
  ReferenceDataCode,
  StorageData,
} from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import InformationModelForm from "../../../../../../components/information-model-form";
import { updateInformationModel } from "../../../../../../app/actions/actions";

type EditPageProps = {
  catalogId: string;
  informationModel: InformationModel;
  statuses: ReferenceDataCode[];
};

export const EditPage = ({
  catalogId,
  informationModel,
  statuses,
}: EditPageProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "informationModelForm",
  });

  const handleUpdate = async (values: InformationModel) => {
    return await updateInformationModel(catalogId, informationModel, values);
  };

  const handleCancel = () => {
    window.location.replace(
      `/catalogs/${catalogId}/information-models/${informationModel.id}`,
    );
  };

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${catalogId}/information-models`);
  };

  useEffect(() => {
    if (searchParams.get("created") === "true") {
      setShowSnackbar(true);

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
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize="1.25em" />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <InformationModelForm
        initialValues={informationModel}
        statuses={statuses}
        autoSaveStorage={dataStorage}
        autoSaveId={informationModel.id}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        showSnackbarSuccessOnInit={showSnackbar}
      />
    </>
  );
};
