import React from 'react';
import { checkAdminPermissions } from '../../../../utils/auth';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import GeneralPageClient from './general-page-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@catalog-frontend/utils';

export const GeneralPage = async ({ params }) => {
  const { catalogId } = params;
  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/general' })) {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <GeneralPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  }
};

export default GeneralPage;
