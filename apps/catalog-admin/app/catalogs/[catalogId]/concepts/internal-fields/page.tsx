import React from 'react';
import { Organization } from '@catalog-frontend/types';
import { withProtectedPage } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import InternalFieldsPageClient from './internal-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/internal-fields`,
  async ({ catalogId }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    return (
      <InternalFieldsPageClient
        organization={organization}
        catalogId={catalogId}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
    );
  },
);
