import React from 'react';
import { checkAdminPermissions } from '../../../../utils/auth';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import GeneralPageClient from './general-page-client';

export const GeneralPage = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <GeneralPageClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default GeneralPage;
