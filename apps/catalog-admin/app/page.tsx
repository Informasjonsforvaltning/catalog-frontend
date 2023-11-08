import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { authOptions, getResourceRoles } from '@catalog-frontend/utils';
import { Session, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AppPageClient from './app-page-client';

const Home = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) redirect('/auth/signin');
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(
      `/auth/signin?callbackUrl=${encodeURIComponent(process.env.NEXT_PUBLIC_CATALOG_ADMIN_BASE_URI as string)}`,
    );
  }

  const resourceRoles = getResourceRoles(`${session?.accessToken}`);
  const organiztionIdsWithAdminRole = resourceRoles
    .filter((role) => role.resource === 'organization' && role.role === 'admin')
    .map((role) => role.resourceId);

  let organizations: Organization[] = [];
  if (organiztionIdsWithAdminRole.length > 0) {
    organizations = await getOrganizations(organiztionIdsWithAdminRole).then((res) => res.json());
  }

  return <AppPageClient organizations={organizations} />;
};

export default Home;
