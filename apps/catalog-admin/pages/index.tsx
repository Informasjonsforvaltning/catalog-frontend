import React from 'react';
import styles from './style.module.css';
import { Card } from '@catalog-frontend/ui';
import { Session, getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { getResourceRoles } from '@catalog-frontend/utils';
import { getOrganizations } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { authOptions } from './api/auth/[...nextauth]';
import { InferGetServerSidePropsType } from 'next';

export function Index({ organizations }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div>
        <div className={styles.card}>
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
  const token = await getToken({ req });

  if (!(session?.user && Date.now() < token?.expires_at * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin`,
      },
    };
  }

  const resourceRoles = getResourceRoles(token.access_token);
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
