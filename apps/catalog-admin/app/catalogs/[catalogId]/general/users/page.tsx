import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from '../../../../../utils/auth';
import UsersPageClient from './users-page-client';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';

export const UsersPage = async ({ params }) => {
  const { catalogId } = params;

  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/general/users' })) {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <UsersPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  }
};

export default UsersPage;
