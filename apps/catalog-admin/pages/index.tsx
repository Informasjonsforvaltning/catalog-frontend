import React from 'react';
import { Breadcrumbs, Card } from '@catalog-frontend/ui';
import { Session, getServerSession } from 'next-auth';
import { getResourceRoles } from '@catalog-frontend/utils';
import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { authOptions } from './api/auth/[...nextauth]';
import { InferGetServerSidePropsType } from 'next';

export function Index({ organizations }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Breadcrumbs />
      <div>
        <div className='card'>
          {organizations.length === 0 && <div>Du har ikke tilgang</div>}
          {organizations.map((organization) => (
            <Card
              key={organization.organizationId}
              title={organization.name}
              href={`/catalogs/${organization.organizationId}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=${encodeURIComponent(req.url)}`,
      },
    };
  }

  const resourceRoles = getResourceRoles(`${session?.accessToken}`);
  const organiztionIdsWithAdminRole = resourceRoles
    .filter((role) => role.resource === 'organization' && role.role === 'admin')
    .map((role) => role.resourceId);

  let organizations: Organization[] = [];
  if (organiztionIdsWithAdminRole.length > 0) {
    organizations = await getOrganizations(organiztionIdsWithAdminRole).then((res) => res.json());
  }

  return {
    props: {
      organizations,
    },
  };
}

export default Index;
