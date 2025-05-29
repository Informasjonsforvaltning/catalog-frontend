'use client';

import { ImportResult } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { deleteImportResult } from '../../../../../actions/actions';
import { ImportResultDetails } from '@catalog-frontend/ui';

interface Props {
  catalogId: string;
  importResult: ImportResult;
}

const ImportResultDetailsPageClient = ({ catalogId, importResult }: Props) => {
  const handleDeleteImportResult = async (resultId: string) => {
    const confirmText =
      importResult.status === 'COMPLETED'
        ? `${localization.importResult.confirmDelete} ${localization.importResult.deleteCanResultInDuplicates}`
        : localization.importResult.confirmDelete;
    if (window.confirm(confirmText)) {
      try {
        await deleteImportResult(catalogId, resultId);
      } catch (error) {
        window.alert(error);
      }
    }
  };

  return (
    <ImportResultDetails
      targetBaseHref={`catalogs/${catalogId}/data-services`}
      importResult={importResult}
      deleteHandler={handleDeleteImportResult}
    />
  );
};

export default ImportResultDetailsPageClient;
