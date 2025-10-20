'use client';

import { ReferenceDataCode, Service, StorageData } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { getPublicServiceById, updatePublicService } from '@service-catalog/app/actions/public-services/actions';
import ServiceForm from '@service-catalog/components/service-form';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type EditPageProps = {
  service: Service;
  statuses: ReferenceDataCode[];
};

export const EditPage = (props: EditPageProps) => {
  const { service, statuses } = props;
  const router = useRouter();
  const { catalogId, serviceId } = useParams<{ catalogId: string; serviceId: string }>();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: 'serviceForm',
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
    const newValues = await getPublicServiceById(catalogId, serviceId);
    return newValues;
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
          variant='tertiary'
          color='second'
          size='sm'
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize='1.25em' />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ServiceForm
        autoSaveStorage={dataStorage}
        onCancel={handleCancel}
        onSubmit={handleUpdate}
        initialValues={service}
        statuses={statuses}
        type='public-services'
      />
    </>
  );
};
