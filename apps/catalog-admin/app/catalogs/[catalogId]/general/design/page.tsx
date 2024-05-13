import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { withProtectedPage } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import DesignPageClient from './design-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/general/design`,
  async ({ catalogId, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <DesignPageClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  },
);
