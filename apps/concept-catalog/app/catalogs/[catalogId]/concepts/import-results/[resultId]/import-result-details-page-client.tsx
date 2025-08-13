'use client';

import { ImportResult } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { deleteImportResult } from '../../../../../actions/concept/actions';
import { ConfirmModal, ImportResultDetails } from '@catalog-frontend/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

  const handleDeleteClick = async () => {
    setShowDeleteConfirm(true);
  };

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
        importResult={importResult}
        deleteHandler={handleDeleteClick}
      />
    </>
  );
};

export default ImportResultDetailsPageClient;