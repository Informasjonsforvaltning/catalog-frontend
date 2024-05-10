import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { withProtectedPage } from '../../../../../utils/auth';
import UsersPageClient from './users-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general/users`,
  async ({ catalogId, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <UsersPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  },
);
