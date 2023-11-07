import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import InternalFieldsPageClient from './internal-page-client';

export async function InternalFieldsPage({ params }) {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <InternalFieldsPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
}

export default InternalFieldsPage;
