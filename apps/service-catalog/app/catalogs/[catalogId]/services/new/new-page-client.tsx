'use client';

import { ReferenceDataCode, Service, StorageData } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ServiceForm from '@service-catalog/components/service-form';
import { createService, getServiceById } from '@service-catalog/app/actions/services/actions';
import { serviceTemplate } from '@service-catalog/components/basic-service-form/service-template';

type NewPageProps = {
  statuses: ReferenceDataCode[];
  type: 'public-services' | 'services';
};

export const NewPage = (props: NewPageProps) => {
  const { statuses, type } = props;
  const router = useRouter();
  const { catalogId } = useParams<{ catalogId: string }>();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: 'serviceForm',
  });

  const handleGotoOverview = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/services`);
  };

  const handleCancel = () => {
    dataStorage.delete();
    router.push(`/catalogs/${catalogId}/services`);
  };

  const handleCreate = async (values: Service) => {
    const maybeServiceId = await createService(catalogId, values);
    if (!maybeServiceId) {
      throw new Error('Service creation failed, no service ID returned');
    } else {
      router.replace(`/catalogs/${catalogId}/services/${maybeServiceId}/edit`);
      return getServiceById(catalogId, maybeServiceId);
    }
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
        onSubmit={handleCreate}
        initialValues={serviceTemplate(undefined)}
        statuses={statuses}
        type={type}
      />
    </>
  );
};
