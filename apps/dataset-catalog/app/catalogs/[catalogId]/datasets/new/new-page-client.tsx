'use client';

import { DatasetToBeCreated, StorageData } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { createDataset, getDatasetById } from '@dataset-catalog/app/actions/actions';
import DatasetForm from '@dataset-catalog/components/dataset-form';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';

type NewPageProps = {
  dataset: DatasetToBeCreated;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: any;
};

export const NewPage = ({ dataset, searchEnv, referenceDataEnv, referenceData }: NewPageProps) => {
  const datasetIdRef = useRef<string | undefined>(undefined); // Ref to store the dataset id
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({ key: 'datasetForm' });

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.href = `/catalogs/${dataset.catalogId}/datasets`;
  };

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${dataset.catalogId}/datasets`);
  };

  const handleAfterSubmit = () => {
    if (datasetIdRef.current) {
      window.location.replace(`/catalogs/${dataset.catalogId}/datasets/${datasetIdRef.current}/edit?created=true`);
    } else {
      window.location.replace(`/catalogs/${dataset.catalogId}/datasets`);
    }
  };

  const handleCreate = async (values: DatasetToBeCreated) => {
    if (!dataset.catalogId) return;

    const datasetId = await createDataset(values, dataset.catalogId.toString());
    datasetIdRef.current = datasetId;
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
          variant='tertiary'
          color='second'
          size='sm'
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize='1.25em' />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <DatasetForm
        afterSubmit={handleAfterSubmit}
        autoSaveStorage={dataStorage}
        initialValues={dataset}
        submitType={'create'}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
        onSubmit={handleCreate}
        onCancel={handleCancel}
      />
    </>
  );
};
