import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { withProtectedPage } from '../../../../utils/auth';
import ConceptsPageClient from './concepts-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts`,
  async ({ catalogId, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <ConceptsPageClient
        organization={organization}
        catalogId={catalogId}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
    );
  },
);
