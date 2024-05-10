import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { withProtectedPage } from '../../../utils/auth';
import AdminPageClient from './admin-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}`,
  async ({ catalogId }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <AdminPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  },
);
