'use client';

import { ImportResult } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { confirmImport, cancelImport, deleteImportResult } from '../../../../../actions/concept/actions';
import { ConfirmModal, ImportResultDetails } from '@catalog-frontend/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Props {
  catalogId: string;
  importResult: ImportResult;
}

const ImportResultDetailsPageClient = ({ catalogId, importResult }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const handleDeleteConfirmed = async () => {
    try {
      await deleteImportResult(catalogId, importResult.id);
      router.push(`/catalogs/${catalogId}/concepts/import-results`);
    } catch (error) {
      window.alert(error);
    }
  };
  const qc = useQueryClient();

  const handleDeleteClick = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmMutation = useMutation({
    mutationFn: async () => await confirmImport(catalogId, importResult.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['refresh-import-result', catalogId, importResult.id] });
    },
  });

    const handleConfirmClick = () => {
      confirmMutation.mutate()
    };

    const cancelMutation = useMutation({
      mutationFn: async () => await cancelImport(catalogId, importResult.id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['refresh-import-result', catalogId, importResult.id] });
      },
    });

    const handleCancelClick = () => {
      console.log("Cancelling import", catalogId, importResult.id);
      cancelMutation.mutate();
    };

    const shouldRefetch = (fetchedData)=> fetchedData.status === 'IN_PROGRESS';

    const { data } = useQuery({
      queryKey: ['refresh-import-result', catalogId, importResult?.id],
      queryFn: async () => {
        const response = await fetch(`/api/catalogs/${catalogId}/concepts/import-results/${importResult?.id}`, {
          method: 'GET',
        });
        return response.json();
      },
      initialData: importResult, // seed from server
      refetchInterval: (q) => {
        const status = q?.state?.data?.status;
        console.log("Status", status)

        return shouldRefetch(q?.state?.data) ? 3000 : false;
      },
      refetchOnWindowFocus: false,
      retry: 2,
    });

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmModal
          title={localization.importResult.confirmDelete}
          content={importResult.status === 'COMPLETED' ? localization.importResult.deleteCanResultInDuplicates : ''}
          onSuccess={handleDeleteConfirmed}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <ImportResultDetails
        targetBaseHref={`catalogs/${catalogId}/concepts`}
        importResult={data}
        deleteHandler={handleDeleteClick}
        confirmHandler={handleConfirmClick}
        cancelHandler={handleCancelClick}
        showCancellationButton={true}
        showConfirmationButton={true}
      />
    </>
  );
};

export default ImportResultDetailsPageClient;