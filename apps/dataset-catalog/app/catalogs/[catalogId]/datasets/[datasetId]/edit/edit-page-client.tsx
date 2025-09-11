'use client';

import { Dataset, StorageData } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { getDatasetById, updateDataset } from '@dataset-catalog/app/actions/actions';
import DatasetForm from '@dataset-catalog/components/dataset-form';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type EditPageProps = {
  dataset: Dataset;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: any;
};

export const EditPage = ({ dataset, searchEnv, referenceDataEnv, referenceData }: EditPageProps) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dataStorage = new LocalDataStorage<StorageData>({
    key: 'datasetForm',
    secondaryKeys: {
      distribution: 'datasetFormDistribution',
      reference: 'datasetFormReference'
    }
  });

  if (dataset.specializedType === 'SERIES') {
    window.location.replace(`/catalogs/${dataset.catalogId}/datasets/${dataset.id}`);
  }

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.href = `/catalogs/${dataset.catalogId}/datasets`;
  };

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(`/catalogs/${dataset.catalogId}/datasets/${dataset.id}`);
  };

  const handleUpdate = async (values: Dataset) => {
    await updateDataset(dataset.catalogId.toString(), dataset, values);
    const newValues = await getDatasetById(dataset.catalogId, dataset.id);
    return newValues;
  };

  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      setShowSnackbar(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('created');

      const newUrl = newParams.toString().length > 0 ? `${pathname}?${newParams.toString()}` : pathname;

      window.history.replaceState(null, '', newUrl);
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
        autoSaveStorage={dataStorage}
        initialValues={dataset}
        submitType={'update'}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        showSnackbarSuccessOnInit={showSnackbar}
      />
    </>
  );
};
