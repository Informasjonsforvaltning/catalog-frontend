import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import DesignPageClient from './design-page-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catalog-frontend/utils';

const DesignPage = async ({ params }) => {
  const { catalogId } = params;
  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/general/design' })) {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <DesignPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  }
};

export default DesignPage;
