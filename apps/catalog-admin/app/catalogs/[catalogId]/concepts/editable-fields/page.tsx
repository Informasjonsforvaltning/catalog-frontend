import { Organization } from '@catalog-frontend/types';

import { checkAdminPermissions } from '../../../../../utils/auth';
import { getOrganization } from '@catalog-frontend/data-access';
import EditableFieldsClient from './editable-fields-client';

const EditableFields = async ({ params }) => {
  const { catalogId } = params;
  checkAdminPermissions(catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return (
    <EditableFieldsClient
      organization={organization}
      catalogId={catalogId}
    />
  );
};

export default EditableFields;
