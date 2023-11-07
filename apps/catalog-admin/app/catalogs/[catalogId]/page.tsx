import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from '../../../utils/auth';
import AdminPageClient from './admin-page-client';

export const CatalogsAdminPage = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <AdminPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default CatalogsAdminPage;
