import { ChangeRequest, Organization } from '@catalog-frontend/types';
import { getChangeRequests, getOrganization } from '@catalog-frontend/data-access';
import ChangeRequestsPageClient from './change-requests-page-client';
import { withReadProtectedPage } from '../../../utils/auth';

const ChangeRequestsPage = withReadProtectedPage(
  ({ catalogId }) => `/${catalogId}/change-requests`,
  async ({ catalogId, session }) => {
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
      />
    );
  },
);

export default ChangeRequestsPage;
