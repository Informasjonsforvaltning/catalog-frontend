import { Fields, Organization } from '@catalog-frontend/types';
import { withProtectedPage } from '../../../../../utils/auth';
import { getFields, getOrganization } from '@catalog-frontend/data-access';
import CodeListsPageClient from './code-list-page-client';

export default withProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/concepts/code-lists`,
  async ({ catalogId, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    const { internal, editable }: Fields = await getFields(catalogId, session.accessToken).then((res) => res.json());

    const codeListsInUse: string[] = [];

    internal.forEach((field) => {
      if (field.codeListId != null) {
        codeListsInUse.push(field.codeListId);
      }
    });

    if (editable?.domainCodeListId !== null) {
      codeListsInUse.push(editable.domainCodeListId);
    }

    return (
      <CodeListsPageClient
        organization={organization}
        catalogId={catalogId}
        codeListsInUse={codeListsInUse}
      />
    );
  },
);
