import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from 'apps/catalog-admin/utils/auth';
import ConceptsPageClient from './concepts-page-client';

const ConceptsPage = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <ConceptsPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default ConceptsPage;
