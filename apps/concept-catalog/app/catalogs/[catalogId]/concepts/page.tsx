import { prepareStatusList } from '@catalog-frontend/utils';
import { CodeListsResult, FieldsResult, Organization, UsersResult } from '@catalog-frontend/types';
import {
  getAllCodeLists,
  getConceptStatuses,
  getFields,
  getOrganization,
  getUsers,
} from '@catalog-frontend/data-access';
import { SearchPageClient } from './search-page-client';
import { withReadProtectedPage } from '../../../../utils/auth';

const SearchPage = withReadProtectedPage(
  ({ catalogId }) => `/${catalogId}`,
  async ({ catalogId, session, hasWritePermission, hasAdminPermission }) => {
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
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
    );
  },
);

export default SearchPage;
