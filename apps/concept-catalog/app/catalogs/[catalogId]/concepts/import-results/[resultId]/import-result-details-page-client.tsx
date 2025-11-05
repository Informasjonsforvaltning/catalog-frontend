'use client';

import { ImportResult } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import {
  cancelImport,
  deleteImportResult,
  saveImportedConcept,
} from '../../../../../actions/concept/actions';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const deleteImportMutation = useMutation({
    mutationFn: async ({ catalogId, importResultId }: { catalogId: string; importResultId: string }) => {
      await deleteImportResult(catalogId, importResultId)
      await router.push(`/catalogs/${catalogId}/concepts/import-results`)
      await setShowDeleteConfirm(false);
    },
    onError: (error) => {
      setIsDeleting(false)
      window.alert(error);
    },
  });

  const qc = useQueryClient();

  const handleDeleteClick = async () => {
    setShowDeleteConfirm(true);
  };

  const saveConceptMutation = useMutation({
    mutationFn: async (externalId: string) => {
      await saveImportedConcept(catalogId, importResult.id, externalId);
    },
    onSuccess: async () => {
      await refetch()
    }
  });

    const cancelMutation = useMutation({
      mutationFn: async () => await cancelImport(catalogId, importResult.id),
      onMutate: async () => {
        qc.setQueryData(['refresh-import-result', catalogId, importResult?.id], (old: ImportResult) => ({
          ...old,
          status: 'CANCELLING',
        }));
      },
      onSuccess: async () => {
        await refetch()
        qc.setQueryData(['refresh-import-result', catalogId, importResult?.id], (old: ImportResult) => ({
          ...old,
          status: 'CANCELLED',
        }));
        await setIsCancelling(false)
      },
    });

    const handleCancelClick = async () => {
      setIsCancelling(true);
      await cancelMutation.mutateAsync();
    };

    const shouldRefetch = (fetchedData)=> fetchedData?.status === 'IN_PROGRESS';

    const { data, refetch } = useQuery({
      queryKey: ['refresh-import-result', catalogId, importResult?.id],
      queryFn: async () => {
        const response = await fetch(`/api/catalogs/${catalogId}/concepts/import-results/${importResult?.id}`, {
          method: 'GET',
        });
        return response.json();
      },
      initialData: importResult,
      refetchInterval: (q) => shouldRefetch(q?.state?.data) ? 3000 : false,
      refetchOnWindowFocus: true,
      enabled: (q) => shouldRefetch(q?.state?.data),
      retry: 2,
    });

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmModal
          title={localization.importResult.confirmDelete}
          content={importResult.status === 'COMPLETED' ? localization.importResult.deleteCanResultInDuplicates : ''}
          onSuccess={async () => {
            await setIsDeleting(true);
            await deleteImportMutation.mutate({ catalogId: catalogId, importResultId: importResult.id });
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {data && (
        <ImportResultDetails
          targetBaseHref={`catalogs/${catalogId}/concepts`}
          importResult={data}
          deleteHandler={handleDeleteClick}
          cancelHandler={handleCancelClick}
          cancelMutation={cancelMutation}
          saveConceptMutation={saveConceptMutation}
          isCancelling={isCancelling}
          isDeleting={isDeleting}
          showCancellationButton={true}
        />
      )}
    </>
  );
};

export default ImportResultDetailsPageClient;