"use client";

import {
  ReferenceDataCode,
  Service,
  StorageData,
} from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ServiceForm from "@service-catalog/components/service-form";
import { createService } from "@service-catalog/app/actions/services/actions";
import { serviceTemplate } from "@service-catalog/components/service-form/service-template";

type NewPageProps = {
  referenceDataEnv: string;
  statuses: ReferenceDataCode[];
};

export const NewPage = (props: NewPageProps) => {
  const { referenceDataEnv, statuses } = props;
  const router = useRouter();
  const { catalogId } = useParams<{ catalogId: string }>();
  const serviceIdRef = useRef<string | undefined>(undefined); // Ref to store the service id

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "serviceForm",
  });

  const handleGotoOverview = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/services`);
  };

  const handleCancel = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/services`);
  };

  const handleAfterSubmit = () => {
    if (serviceIdRef.current) {
      router.replace(
        `/catalogs/${catalogId}/services/${serviceIdRef.current}/edit`,
      );
    } else {
      router.replace(`/catalogs/${catalogId}/services`);
    }
  };

  const handleCreate = async (values: Service) => {
    serviceIdRef.current = await createService(catalogId, values);
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
      <ServiceForm
        afterSubmit={handleAfterSubmit}
        autoSaveStorage={dataStorage}
        onCancel={handleCancel}
        onSubmit={handleCreate}
        initialValues={serviceTemplate(undefined)}
        referenceDataEnv={referenceDataEnv}
        statuses={statuses}
        type="services"
      />
    </>
  );
};
