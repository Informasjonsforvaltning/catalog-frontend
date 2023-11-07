import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { authOptions, getResourceRoles } from '@catalog-frontend/utils';
import { Session, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AppPageClient from './app-page-client';
import { cookies } from 'next/headers';

const App = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) redirect('/auth/signin');

  if (session?.accessTokenExpiresAt && !(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    const cookieStore = cookies();
    const callbackUrl = cookieStore.get('next-auth.callback-url')?.value ?? '';
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
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

export default App;
