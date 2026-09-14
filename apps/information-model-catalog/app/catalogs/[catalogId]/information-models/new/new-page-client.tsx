"use client";

import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useRef, useState } from "react";
import type {
  InformationModel,
  InformationModelToBeCreated,
  StorageData,
} from "@catalog-frontend/types";
import InformationModelForm from "../../../../../components/information-model-form";
import { createInformationModel } from "@information-model-catalog/app/actions/actions";
import { useRouter } from "next/navigation";

type NewInformationModelPageClientProps = {
  catalogId: string;
  initialValues: InformationModelToBeCreated;
};

export const NewInformationModelPageClient = ({
  catalogId,
  initialValues,
}: NewInformationModelPageClientProps) => {
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const informationModelIdRef = useRef<string | undefined>(undefined);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "informationModelForm",
  });

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${catalogId}/information-models`);
  };

  const handleCreate = async (values: InformationModel) => {
    informationModelIdRef.current = await createInformationModel(
      catalogId.toString(),
      values,
    );
    return undefined;
  };

  const handleAfterSubmit = async () => {
    if (informationModelIdRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.replace(
        `/catalogs/${catalogId}/information-models/${informationModelIdRef.current}/edit?created=true`,
      );
    } else {
      router.replace(`/catalogs/${catalogId}/information-models`);
    }
  };

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleCancel}
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
        initialValues={initialValues}
        autoSaveStorage={dataStorage}
        onCancel={handleCancel}
        onSubmit={handleCreate}
        afterSubmit={handleAfterSubmit}
      />
    </>
  );
};
