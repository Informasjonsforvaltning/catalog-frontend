import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { hasOrganizationReadPermission } from '@catalog-frontend/utils';
import { ChangeRequest, Concept, Organization, SearchConceptQuery } from '@catalog-frontend/types';
import { getChangeRequests, getOrganization, searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { RedirectType, redirect } from 'next/navigation';
import ChangeRequestsPageClient from './change-requests-page-client';

const ChangeRequestsPage = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const { catalogId } = params;

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasPermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const changeRequests: ChangeRequest[] = await getChangeRequests(catalogId, `${session.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });

  const originalIds = changeRequests
    .map((cr) => cr.conceptId)
    .filter((conceptId) => conceptId !== null && conceptId !== undefined);

  const searchQuery: SearchConceptQuery = {
    query: '',
    pagination: {
      page: 0,
      size: originalIds.length,
    },
    fields: undefined,
    sort: undefined,
    filters: { originalId: { value: originalIds } },
  };

  const response = await searchConceptsForCatalog(catalogId, searchQuery, session?.accessToken);
  const conceptsWithChangeRequest: Concept[] = await response.json();

  return (
    <ChangeRequestsPageClient
      catalogId={catalogId}
      organization={organization}
      changeRequests={changeRequests}
      conceptsWithChangeRequest={conceptsWithChangeRequest}
    />
  );
};

export default ChangeRequestsPage;
