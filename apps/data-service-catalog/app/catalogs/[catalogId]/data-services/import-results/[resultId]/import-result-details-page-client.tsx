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
    if (window.confirm(localization.serviceCatalog.form.confirmDelete)) {
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
