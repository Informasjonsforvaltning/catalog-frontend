"use client";

import {
  StorageData,
  DatasetToBeCreated,
  ReferenceData,
} from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import { createDataset } from "@dataset-catalog/app/actions/actions";
import DatasetForm from "@dataset-catalog/components/dataset-form/index";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type NewPageProps = {
  catalogId: string;
  dataset: DatasetToBeCreated;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: ReferenceData;
};

export const NewPage = ({
  catalogId,
  dataset,
  searchEnv,
  referenceDataEnv,
  referenceData,
}: NewPageProps) => {
  const datasetIdRef = useRef<string | undefined>(undefined); // Ref to store the dataset id
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "datasetForm",
    secondaryKeys: {
      distribution: "datasetFormDistribution",
      reference: "datasetFormReference",
    },
  });

  const handleGotoOverview = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/datasets`);
  };

  const handleCancel = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/datasets`);
  };

  const handleAfterSubmit = () => {
    if (datasetIdRef.current) {
      router.replace(
        `/catalogs/${catalogId}/datasets/${datasetIdRef.current}/edit`,
      );
    } else {
      router.replace(`/catalogs/${catalogId}/datasets`);
    }
  };

  const handleCreate = async (values: DatasetToBeCreated) => {
    if (!catalogId) return;

    datasetIdRef.current = await createDataset(values, catalogId);
    return undefined;
  };

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
      <DatasetForm
        afterSubmit={handleAfterSubmit}
        autoSaveStorage={dataStorage}
        initialValues={dataset}
        submitType={"create"}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
        onSubmit={handleCreate}
        onCancel={handleCancel}
        isMobility={true}
      />
    </>
  );
};
