import React from 'react';
import { withProtectedPage } from '../../../../utils/auth';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import GeneralPageClient from './general-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general`,
  async ({ catalogId }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <GeneralPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  },
);
