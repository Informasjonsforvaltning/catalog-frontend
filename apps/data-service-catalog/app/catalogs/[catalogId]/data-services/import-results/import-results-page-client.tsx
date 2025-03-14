'use client';

import OpenapiUploader from '../../../../../components/openapi-uploader';
import {ImportResult} from "@catalog-frontend/types";

interface Props {
  catalogId: string;
  hasAdminPermission: boolean;
  importResults: ImportResult[];
}

const ImportResultsPageClient = ({ catalogId, hasAdminPermission, importResults }: Props) => {
  return <div>
    {hasAdminPermission && <OpenapiUploader catalogId={catalogId} />}
    {importResults?.map((item: ImportResult) => (
      <div key={item.id}>{item.status}</div>
    ))}
  </div>;
};

export default ImportResultsPageClient;
