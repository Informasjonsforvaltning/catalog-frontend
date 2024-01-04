import { Organization } from '@catalog-frontend/types';

import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import EditableFieldsClient from './editable-fields-client';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';

const EditableFields = async ({ params }) => {
  const { catalogId } = params;
  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/concepts/editable-fields' })) {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    return (
      <EditableFieldsClient
        organization={organization}
        catalogId={catalogId}
      />
    );
  }
};

export default EditableFields;
