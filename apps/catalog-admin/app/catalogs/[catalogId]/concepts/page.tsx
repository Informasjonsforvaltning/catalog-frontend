import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { checkAdminPermissions } from '../../../../utils/auth';
import ConceptsPageClient from './concepts-page-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catalog-frontend/utils';

const ConceptsPage = async ({ params }) => {
  const { catalogId } = params;
  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/concepts' })) {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <ConceptsPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  }
};

export default ConceptsPage;
