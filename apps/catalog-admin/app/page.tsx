import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { authOptions, getResourceRoles } from '@catalog-frontend/utils';
import HomePageClient from './home-page-client';
import { checkAuthenticated } from '../utils/auth';
import { getServerSession } from 'next-auth';

const Home = async () => {
  const session = await getServerSession(authOptions);
  checkAuthenticated({ session, callbackUrl: '/' });

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
