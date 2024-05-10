import { Organization } from '@catalog-frontend/types';

import { withProtectedPage } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import EditableFieldsClient from './editable-fields-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/editable-fields`,
  async ({ catalogId }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    return (
      <EditableFieldsClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  },
);
