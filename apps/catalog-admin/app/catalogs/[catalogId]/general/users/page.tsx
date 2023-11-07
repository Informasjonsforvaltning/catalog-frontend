import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from '../../../../../utils/auth';
import UsersPageClient from './users-page-client';

export const UsersPage = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <UsersPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default UsersPage;
