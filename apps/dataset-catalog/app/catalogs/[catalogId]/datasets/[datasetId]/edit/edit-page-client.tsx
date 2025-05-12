'use client';

import { Dataset } from '@catalog-frontend/types';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import DatasetForm from '@dataset-catalog/components/dataset-form';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

type EditPageProps = {
  dataset: Dataset;
  searchEnv: string;
  referenceDataEnv: string;
  referenceData: any;
};

export const EditPage = ({ dataset, searchEnv, referenceDataEnv, referenceData }: EditPageProps) => {
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
        submitType={'update'}
        searchEnv={searchEnv}
        referenceDataEnv={referenceDataEnv}
        referenceData={referenceData}
      />
    </>
  );
};
