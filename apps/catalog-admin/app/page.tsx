import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { getResourceRoles, getValidSession } from '@catalog-frontend/utils';
import HomePageClient from './home-page-client';

const Home = async () => {
  const session = await getValidSession({ callbackUrl: `/` });
  const resourceRoles = getResourceRoles(`${session?.accessToken}`);
  const organiztionIdsWithAdminRole = resourceRoles
    .filter((role) => role.resource === 'organization' && role.role === 'admin')
    .map((role) => role.resourceId);

  let organizations: Organization[] = [];
  if (organiztionIdsWithAdminRole.length > 0) {
    organizations = await getOrganizations(organiztionIdsWithAdminRole).then((res) => res.json());
  }

  return <HomePageClient organizations={organizations} />;
};

export default Home;
