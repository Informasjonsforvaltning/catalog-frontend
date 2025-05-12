'use client';

import { DatasetToBeCreated } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import DatasetForm from '@dataset-catalog/components/dataset-form';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

type NewPageProps = {
  dataset: DatasetToBeCreated;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: any;
};

export const NewPage = ({ dataset, searchEnv, referenceDataEnv, referenceData }: NewPageProps) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  function handleGotoOverview(): void {
    window.location.href = `/catalogs/${dataset.catalogId}/datasets`;
  }

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
        initialValues={dataset}
        submitType={'create'}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
      />
    </>
  );
};
