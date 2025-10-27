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

  const saveConceptMutation = useMutation({
    mutationFn: async (externalId: string) => {
      await saveImportedConcept(catalogId, importResult.id, externalId);
      refetch()
    },
  });

    const cancelMutation = useMutation({
      mutationFn: async () => await cancelImport(catalogId, importResult.id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['refresh-import-result', catalogId, importResult.id] });
      },
    });

    const handleCancelClick = () => {
      cancelMutation.mutate();
    };

    const shouldRefetch = (fetchedData)=> fetchedData.status === 'IN_PROGRESS';

    const { data, refetch } = useQuery({
      queryKey: ['refresh-import-result', catalogId, importResult?.id],
      queryFn: async () => {
        const response = await fetch(`/api/catalogs/${catalogId}/concepts/import-results/${importResult?.id}`, {
          method: 'GET',
        });
        return response.json();
      },
      initialData: importResult, // seed from server
      refetchInterval: (q) => shouldRefetch(q?.state?.data) ? 3000 : false,
      refetchOnWindowFocus: true,
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
        cancelHandler={handleCancelClick}
        saveConceptMutation={saveConceptMutation}
        showCancellationButton={true}
      />
    </>
  );
};

export default ImportResultDetailsPageClient;