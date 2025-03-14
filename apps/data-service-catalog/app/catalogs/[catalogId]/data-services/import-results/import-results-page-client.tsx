'use client';

import { ImportResult } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { deleteImportResult } from '../../../../actions/actions';
import { ImportResults } from '@catalog-frontend/ui';

interface Props {
  catalogId: string;
  importResults: ImportResult[];
}

const ImportResultsPageClient = ({ catalogId, importResults }: Props) => {
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
    <ImportResults
      importHref={`/catalogs/${catalogId}/data-services/import-results`}
      importResults={importResults}
      deleteHandler={handleDeleteImportResult}
    />
  );
};

export default ImportResultsPageClient;
