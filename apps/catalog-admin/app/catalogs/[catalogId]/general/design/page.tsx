import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import DesignPageClient from './design-page-client';

const DesignPage = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <DesignPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default DesignPage;
