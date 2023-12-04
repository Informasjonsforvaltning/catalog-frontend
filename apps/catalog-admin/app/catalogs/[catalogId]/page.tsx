import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from '../../../utils/auth';
import AdminPageClient from './admin-page-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catalog-frontend/utils';

export const CatalogsAdminPage = async ({ params }) => {
  const { catalogId } = params;

  const session = await getServerSession(authOptions);
  checkAdminPermissions({ session, catalogId });
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <AdminPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default CatalogsAdminPage;
