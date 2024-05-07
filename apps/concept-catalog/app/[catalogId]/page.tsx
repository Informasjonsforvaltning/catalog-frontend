import {
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  validOrganizationNumber,
  prepareStatusList,
  authOptions,
} from '@catalog-frontend/utils';
import { CodeListsResult, FieldsResult, Organization, UsersResult } from '@catalog-frontend/types';
import {
  getAllCodeLists,
  getConceptStatuses,
  getFields,
  getOrganization,
  getUsers,
} from '@catalog-frontend/data-access';
import { Session, getServerSession } from 'next-auth';
import { SearchPageClient } from './search-page-client';
import { RedirectType, redirect } from 'next/navigation';

const SearchPage = async ({ params }) => {
  const session: Session | null = await getServerSession(authOptions);
  const { catalogId } = params;

  if (!validOrganizationNumber(catalogId)) {
    redirect(`/notfound`, RedirectType.replace);
  }

  const hasReadPermission =
    session?.accessToken &&
    (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session.accessToken));
  if (!hasReadPermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }

  const hasWritePermission = session?.accessToken && hasOrganizationWritePermission(session.accessToken, catalogId);
  const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );
  const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
    (response) => response.json(),
  );

  const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
    response.json(),
  );

  const conceptStatuses = await getConceptStatuses()
    .then((response) => response.json())
    .then((body) => body?.conceptStatuses ?? [])
    .then((statuses) => prepareStatusList(statuses));

  return (
    <SearchPageClient
      catalogId={catalogId}
      organization={organization}
      hasWritePermission={!!hasWritePermission}
      hasAdminPermission={!!hasAdminPermission}
      fieldsResult={fieldsResult}
      codeListsResult={codeListsResult}
      usersResult={usersResult}
      conceptStatuses={conceptStatuses}
      FDK_REGISTRATION_BASE_URI={`${process.env.FDK_REGISTRATION_BASE_URI}`}
    />
  );
};

export default SearchPage;
