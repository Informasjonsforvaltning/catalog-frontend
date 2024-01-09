import { getServerSession } from 'next-auth';
import { authOptions, hasOrganizationReadPermission } from '@catalog-frontend/utils';
import { ChangeRequest, Organization } from '@catalog-frontend/types';
import { getChangeRequests, getOrganization } from '@catalog-frontend/data-access';
import { RedirectType, redirect } from 'next/navigation';
import ChangeRequestsPageClient from './change-requests-page-client';

const ChangeRequestsPage = async ({ params, searchParams }) => {
  const session = await getServerSession(authOptions);
  const { catalogId } = params;

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasPermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const reponseData: ChangeRequest[] = await getChangeRequests(catalogId, `${session.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });

  return (
    <ChangeRequestsPageClient
      catalogId={catalogId}
      organization={organization}
      data={reponseData}
      FDK_REGISTRATION_BASE_URI={process.env.FDK_REGISTRATION_BASE_URI}
    />
  );
};

export default ChangeRequestsPage;
