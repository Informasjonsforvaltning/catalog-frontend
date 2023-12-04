import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import InternalFieldsPageClient from './internal-page-client';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';

export async function InternalFieldsPage({ params }) {
  const { catalogId } = params;
  const session = await getServerSession(authOptions);
  checkAdminPermissions({ session, catalogId, path: '/concepts/internal-fields' });
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <InternalFieldsPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
}

export default InternalFieldsPage;
