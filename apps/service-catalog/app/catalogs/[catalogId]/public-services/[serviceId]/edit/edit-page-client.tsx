"use client";

import {
  ReferenceDataCode,
  Service,
  StorageData,
} from "@catalog-frontend/types";
import { Button, ButtonBar, ConfirmModal } from "@catalog-frontend/ui-v2";
import { LocalDataStorage, localization } from "@catalog-frontend/utils";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import {
  getPublicServiceById,
  updatePublicService,
} from "@service-catalog/app/actions/public-services/actions";
import ServiceForm from "@service-catalog/components/service-form";
import { serviceTemplate } from "@service-catalog/components/service-form/service-template";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

type EditPageProps = {
  mainActivities: ReferenceDataCode[];
  referenceDataEnv: string;
  searchEnv: string;
  service: Service;
  statuses: ReferenceDataCode[];
};

export const EditPage = (props: EditPageProps) => {
  const { mainActivities, referenceDataEnv, searchEnv, service, statuses } =
    props;
  const router = useRouter();
  const { catalogId, serviceId } = useParams<{
    catalogId: string;
    serviceId: string;
  }>();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dataStorage = new LocalDataStorage<StorageData>({
    key: "publicServiceForm",
  });

  const handleGotoOverview = () => {
    dataStorage.delete();
    router.push(`/catalogs/${service.catalogId}/public-services`);
  };

  const handleCancel = () => {
    dataStorage.delete();
    router.push(`/catalogs/${service.catalogId}/public-services/${service.id}`);
  };

  const handleUpdate = async (values: Service) => {
    await updatePublicService(catalogId, service, values);
    return getPublicServiceById(catalogId, serviceId);
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
          data-size="sm"
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize="1.25em" />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ServiceForm
        autoSaveStorage={dataStorage}
        mainActivities={mainActivities}
        onCancel={handleCancel}
        onSubmit={handleUpdate}
        initialValues={serviceTemplate(service)}
        referenceDataEnv={referenceDataEnv}
        searchEnv={searchEnv}
        statuses={statuses}
        showSnackbarSuccessOnInit={showSnackbar}
        type="public-services"
      />
    </>
  );
};
