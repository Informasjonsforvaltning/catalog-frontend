import { Fields, Organization } from '@catalog-frontend/types';
import { checkAdminPermissions } from '../../../../../utils/auth';
import { getFields, getOrganization } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import CodeListsPageClient from './code-list-page-client';
import { authOptions } from '@catalog-frontend/utils';

const CodeListsPage = async ({ params }) => {
  const { catalogId } = params;

  const session = await getServerSession(authOptions);
  if (checkAdminPermissions({ session, catalogId, path: '/concepts/code-lists' })) {
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
  }
};

export default CodeListsPage;
